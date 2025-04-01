import {makeBasicOBF, makeOBFEvent} from "./schema.js";

async function getData(url = "") {
  let response
  try {
    response = await fetch(url, {
      method: "GET",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    })
    return await response.json()
  }
  catch(e) {
    console.log(e)
    return null
  }
}

export const getTournamentInfo = async (event) => {
  let obf = makeBasicOBF()
  
  const eventName = event.match(/([^\/]*)\/*$/)[1]
  const subDomain = event.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i)
  let name
  if (subDomain) {
    const sub = subDomain[1]
    name = `${sub}-${eventName}`
  } else {
    name = eventName
  }
  
  const queryString = `${name}.json?api_key=${process.env.CHALLONGE_KEY}&include_participants=1&include_matches=1`
  const eventData = await getData(`${process.env.CHALLONGE_API}tournaments/${queryString}`)
  
  if (eventData.errors)
    return eventData.errors
  
  const tournament = eventData.tournament
  
  const addZero = (num) => num < 10 ? "0"+String(num) : String(num)
  const d = new Date(tournament.started_at)
  const ISO = `${d.getFullYear()}-${addZero(d.getMonth()+1)}-${addZero(d.getDate())}`
  obf.event = makeOBFEvent(tournament.name, ISO, tournament.game_name, tournament.participants_count, tournament.full_challonge_url, tournament.tournament_type)
  
  const participants = eventData.tournament.participants
  
  obf.entrants = participants.map( p => schema.makeOBFEntrant(p.participant.id, p.participant.name, p.participant.seed, p.participant.final_rank))
  obf.entrants = obf.entrants.filter((e) => e.finalPlacement ? true : false)
  
  const sets = eventData.tournament.matches
  
  const statusCheck = (s) => {
    if (s == 'open')
      return 'started'
    
    if (s == 'complete')
      return "completed"
    
    return s
  }
  
  const checkWinner = (wid, pid) => {
    if (!wid)
      return ""
    
    return wid == pid ? "win" : "lose"
  }
  
  const scores = (score, player, set) => {
    if (!score)
      return 0
    
    if (player == 0) {
      return score.match(/[\-]?[0-9]/gi)[0]
    }
    
    
    if (player == 1) {
      
      if (score.charAt(0) == '-') {
        const scoreSplit = score.split('-')
        if (scoreSplit.length == 4) {
          return '-' + scoreSplit[3]
        } else {
          return scoreSplit[2]
        }
        
      } else {
        const scoreSplit = score.split('-')
        if (scoreSplit.length == 3) {
          return '-' + scoreSplit[2]
        } else {
          return scoreSplit[1]
        }
      }
    }
    
    return "theoretically shouldn't get here"
  }
  
  obf.sets = sets.map((s) => {
    let base = schema.makeOBFSet(s.match.id, s.match.player1_id, s.match.player2_id, statusCheck(s.match.state), checkWinner(s.match.winner_id, s.match.player1_id),
        checkWinner(s.match.winner_id, s.match.player2_id), scores(s.match.scores_csv, 0), scores(s.match.scores_csv, 1, s.match), "", "", [])
    if (s.match.player1_prereq_match_id) {
      base.entrant1PrevSetID = s.match.player1_prereq_match_id
    }
    
    if (s.match.player2_prereq_match_id) {
      base.entrant2PrevSetID = s.match.player2_prereq_match_id
    }
    
    return base
  })
  
  for (let i= 0; i < obf.sets.length; i++) {
    let s = obf.sets[i]
    if (!s.entrant1PrevSetID) {
      delete s.entrant1PrevSetID
    } else {
      let nextSet = obf.sets.findIndex((v) => v.setID == s.entrant1PrevSetID)
      
      if (nextSet != -1) {
        const e1id = s.entrant1ID
        
        if (e1id == obf.sets[nextSet].entrant1ID) {
          obf.sets[nextSet].entrant1NextSetID = s.setID
        } else {
          obf.sets[nextSet].entrant2NextSetID = s.setID
        }
      }
    }
    
    if (!s.entrant2PrevSetID) {
      delete s.entrant2PrevSetID
    } else {
      let nextSet = obf.sets.findIndex((v) => v.setID == s.entrant2PrevSetID)
      if (nextSet != -1) {
        const e1id = s.entrant2ID
        
        if (e1id == obf.sets[nextSet].entrant1ID) {
          obf.sets[nextSet].entrant1NextSetID = s.setID
        } else {
          obf.sets[nextSet].entrant2NextSetID = s.setID
        }
      }
    }
  }
  
  
  if (!eventData)
    return obf
  
  return obf
}
