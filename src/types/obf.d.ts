export enum SetGameResult {
    Win = "win",
    Lose = "lose",
    Draw = "draw",
    Dq = "dq",
}

/** Object containing metadata relevant to the entire event, such as the name and date of the event, game played, the format of the tournament (e.g. whether it was single-elim or double-elim), etc. */
export class Event implements IEvent {
    /** String containing the title of this event. This is a required field. */
    name!: string;
    /** Start date of the event. Should be provided in ISO 8601 format (YYYY-MM-DD). */
    date!: Date;
    /** String representing the name of the game played at this event. */
    gameName!: string;
    /** String representing the format of this tournament (e.g. single-elimination, double-elimination, etc.). This field should only be used to record format as it relates to the structure of the tournament (i.e. how matches are decided) and not format as it pertains to game-specific factors (e.g. whether it's a teams tournament, the ruleset in use, etc.). For commonly-used structures, use the following identifiers: 'single-elim' (Single elimination), 'double-elim' (Double elimination), 'round-robin' (Round robin). */
    tournamentStructure!: string;
    /** Array of `Phase` objects containing information about each phase of this tournament. Useful for capturing complicated tournament structures, like round-robin pools leading into a double-elimination bracket (where different phases may have different structures). See the `Phase` definition for more information. */
    phases!: Phase[];
    /** String representing the choice of ruleset. */
    ruleset!: string;
    /** String containing a external URL linking to the original source of this data (e.g. an external tournament website). */
    originURL!: string;
    /** Integer containing the number of entrants in this tournament. If populated, this should be equal to the length of the `entrants` subarray of the root `Tournament` object. */
    numberEntrants!: number;
    /** Object that can be used to store any other relevant event-related information not covered by the previously mentioned fields. */
    other!: any;

    constructor(data?: IEvent) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            this.date = _data["date"] ? new Date(_data["date"].toString()) : <any>undefined;
            this.gameName = _data["gameName"];
            this.tournamentStructure = _data["tournamentStructure"];
            if (Array.isArray(_data["phases"])) {
                this.phases = [] as any;
                for (let item of _data["phases"])
                    this.phases!.push(Phase.fromJS(item));
            }
            this.ruleset = _data["ruleset"];
            this.originURL = _data["originURL"];
            this.numberEntrants = _data["numberEntrants"];
            this.other = _data["other"];
        }
    }

    static fromJS(data: any): Event {
        data = typeof data === 'object' ? data : {};
        let result = new Event();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["date"] = this.date ? formatDate(this.date) : <any>undefined;
        data["gameName"] = this.gameName;
        data["tournamentStructure"] = this.tournamentStructure;
        if (Array.isArray(this.phases)) {
            data["phases"] = [];
            for (let item of this.phases)
                data["phases"].push(item.toJSON());
        }
        data["ruleset"] = this.ruleset;
        data["originURL"] = this.originURL;
        data["numberEntrants"] = this.numberEntrants;
        data["other"] = this.other;
        return data;
    }
}

/** Object containing metadata relevant to the entire event, such as the name and date of the event, game played, the format of the tournament (e.g. whether it was single-elim or double-elim), etc. */
export interface IEvent {
    /** String containing the title of this event. This is a required field. */
    name: string;
    /** Start date of the event. Should be provided in ISO 8601 format (YYYY-MM-DD). */
    date: Date;
    /** String representing the name of the game played at this event. */
    gameName: string;
    /** String representing the format of this tournament (e.g. single-elimination, double-elimination, etc.). This field should only be used to record format as it relates to the structure of the tournament (i.e. how matches are decided) and not format as it pertains to game-specific factors (e.g. whether it's a teams tournament, the ruleset in use, etc.). For commonly-used structures, use the following identifiers: 'single-elim' (Single elimination), 'double-elim' (Double elimination), 'round-robin' (Round robin). */
    tournamentStructure: string;
    /** Array of `Phase` objects containing information about each phase of this tournament. Useful for capturing complicated tournament structures, like round-robin pools leading into a double-elimination bracket (where different phases may have different structures). See the `Phase` definition for more information. */
    phases: Phase[];
    /** String representing the choice of ruleset. */
    ruleset: string;
    /** String containing a external URL linking to the original source of this data (e.g. an external tournament website). */
    originURL: string;
    /** Integer containing the number of entrants in this tournament. If populated, this should be equal to the length of the `entrants` subarray of the root `Tournament` object. */
    numberEntrants: number;
    /** Object that can be used to store any other relevant event-related information not covered by the previously mentioned fields. */
    other: any;
}

/** Object representing an entrant in the tournament. Every unique entrant which appears in a set should have a corresponding `Entrant` object in the `entrants` subfield of `Tournament`. */
export class Entrant implements IEntrant {
    /** Unique string ID corresponding to this entrant. This ID can be an autogenerated identifier, some form of the player's tag, or the player's tag itself, as long as it is guaranteed that no two different entrants share the same `entrantID`. Entrants in `Set` objects are referenced by this ID. This is a required field. */
    entrantID!: string;
    /** String containing the entrant's ``tag; in other words, the name the entrant chooses when registering for the tournament, that appears in results, etc. */
    entrantTag!: string;
    /** Integer representing the initial seeding of this entrant. Larger seeds are worse seeds; 1 is the best possible seed. */
    initialSeed!: number;
    /** Integer representing the final placing of this entrant. */
    finalPlacement!: number;
    /** List of personal data about players corresponding to this entrant (e.g. legal name, country, etc.). If this entrant corresponds to a single player, this will be a list of size one. If it is a team of several players, there will be one entry per player. */
    personalInformation!: PersonalInformation[];
    /** Object that can be used to store any other relevant entrant-related information not covered by the previously mentioned fields. */
    other!: any;

    constructor(data?: IEntrant) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.entrantID = _data["entrantID"];
            this.entrantTag = _data["entrantTag"];
            this.initialSeed = _data["initialSeed"];
            this.finalPlacement = _data["finalPlacement"];
            if (Array.isArray(_data["personalInformation"])) {
                this.personalInformation = [] as any;
                for (let item of _data["personalInformation"])
                    this.personalInformation!.push(PersonalInformation.fromJS(item));
            }
            this.other = _data["other"];
        }
    }

    static fromJS(data: any): Entrant {
        data = typeof data === 'object' ? data : {};
        let result = new Entrant();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["entrantID"] = this.entrantID;
        data["entrantTag"] = this.entrantTag;
        data["initialSeed"] = this.initialSeed;
        data["finalPlacement"] = this.finalPlacement;
        if (Array.isArray(this.personalInformation)) {
            data["personalInformation"] = [];
            for (let item of this.personalInformation)
                data["personalInformation"].push(item.toJSON());
        }
        data["other"] = this.other;
        return data;
    }
}

/** Object representing an entrant in the tournament. Every unique entrant which appears in a set should have a corresponding `Entrant` object in the `entrants` subfield of `Tournament`. */
export interface IEntrant {
    /** Unique string ID corresponding to this entrant. This ID can be an autogenerated identifier, some form of the player's tag, or the player's tag itself, as long as it is guaranteed that no two different entrants share the same `entrantID`. Entrants in `Set` objects are referenced by this ID. This is a required field. */
    entrantID: string;
    /** String containing the entrant's ``tag; in other words, the name the entrant chooses when registering for the tournament, that appears in results, etc. */
    entrantTag: string;
    /** Integer representing the initial seeding of this entrant. Larger seeds are worse seeds; 1 is the best possible seed. */
    initialSeed: number;
    /** Integer representing the final placing of this entrant. */
    finalPlacement: number;
    /** List of personal data about players corresponding to this entrant (e.g. legal name, country, etc.). If this entrant corresponds to a single player, this will be a list of size one. If it is a team of several players, there will be one entry per player. */
    personalInformation: PersonalInformation[];
    /** Object that can be used to store any other relevant entrant-related information not covered by the previously mentioned fields. */
    other: any;
}

/** Object representing personal information (e.g. name, country) associated with an entrant. Subobject of `Entrant`. */
export class PersonalInformation implements IPersonalInformation {
    /** String containing entrant's legal name. */
    name!: string;
    /** String containing entrant's country. */
    country!: string;
    /** String containing entrant's tag. Same as entrantTag if entrant is a single player. */
    tag!: string;
    /** String containing prefix for entrant's tag. */
    prefix!: string;
    /** Object that can be used to store any other relevant personal entrant-related information not covered by the previously mentioned fields. */
    other!: any;

    constructor(data?: IPersonalInformation) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            this.country = _data["country"];
            this.tag = _data["tag"];
            this.prefix = _data["prefix"];
            this.other = _data["other"];
        }
    }

    static fromJS(data: any): PersonalInformation {
        data = typeof data === 'object' ? data : {};
        let result = new PersonalInformation();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["country"] = this.country;
        data["tag"] = this.tag;
        data["prefix"] = this.prefix;
        data["other"] = this.other;
        return data;
    }
}

/** Object representing personal information (e.g. name, country) associated with an entrant. Subobject of `Entrant`. */
export interface IPersonalInformation {
    /** String containing entrant's legal name. */
    name: string;
    /** String containing entrant's country. */
    country: string;
    /** String containing entrant's tag. Same as entrantTag if entrant is a single player. */
    tag: string;
    /** String containing prefix for entrant's tag. */
    prefix: string;
    /** Object that can be used to store any other relevant personal entrant-related information not covered by the previously mentioned fields. */
    other: any;
}

/** Object representing a single set of the tournament. */
export class Set implements ISet {
    /** String containing a unique identifier for this set (i.e. no two sets in the event's `sets` array should have the same setID). */
    setID!: string;
    /** The entrantID of the first player in this match. */
    entrant1ID!: string;
    /** The entrantID of the second player in this match. */
    entrant2ID!: string;
    /** String representing the status of this set. If populated, must take one of the following values: 'completed' (if the set has finished), 'started' (if the set is currently in progress), or 'pending' (if the set has yet to start). */
    status!: SetStatus;
    /** String representing the result of entrant 1 in this match. If populated, must equal either 'win', 'lose', 'draw', or 'dq'. In the case of 'dq', the player disqualified should be assigned the 'dq' result and the other player should be assigned the 'win' result. (If both players are disqualified, both should be assigned 'dq'). */
    entrant1Result!: SetGameResult;
    /** String representing the result of entrant 2 in this match. If populated, must equal either 'win', 'lose', 'draw', or 'dq'. */
    entrant2Result!: SetGameResult;
    /** Integer representing the score of entrant 1 in this match. */
    entrant1Score!: number;
    /** Integer representing the score of entrant 2 in this match. */
    entrant2Score!: number;
    /** The setID of the set that entrant 1 will play next. For a single-elim or double-elim tournament, setting this allows one for reconstruction of the original bracket. If entrant 1 does not play another set (e.g. they have won or are knocked out), do not set this field. */
    entrant1NextSetID!: string;
    /** The setID of the set that entrant 2 will play next. For a double-elim tournament, setting this allows one for reconstruction of the original bracket. If entrant 2 does not play another set, do not set this field. */
    entrant2NextSetID!: string;
    /** The setID of the set that entrant 1 played right before this set. If this is entrant 1's first set, do not set this field. */
    entrant1PrevSetID!: string;
    /** The setID of the set that entrant 2 played right before this set. If this is entrant 2's first set, do not set this field. */
    entrant2PrevSetID!: string;
    /** String representing format specific to this set (e.g. whether it was best of 3 or best of 5). */
    setFormat!: string;
    /** String representing the `phase' of this specific set. It is up to the user's discretion to decide what precisely a phase means. For tournaments with multiple phases / levels (e.g. pools, top 64, top 8), it is convenient to record this information here. */
    phaseID!: string;
    /** String representing the `round' in the bracket of this specific set (for example, "Winner's Round 1" or "Semifinals"). It is up to the user's discretion to decide what precisely a round means and how to record it. */
    roundID!: string;
    /** Array of `Game` objects containing information about each game of this set. It is recommended (but not required) that this array records the games in chronological order. See the `Game` definition for more information. */
    games!: Game[];
    /** Object that can be used to store any other relevant set-related information not covered by the previously mentioned fields. */
    other!: any;

    constructor(data?: ISet) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.setID = _data["setID"];
            this.entrant1ID = _data["entrant1ID"];
            this.entrant2ID = _data["entrant2ID"];
            this.status = _data["status"];
            this.entrant1Result = _data["entrant1Result"];
            this.entrant2Result = _data["entrant2Result"];
            this.entrant1Score = _data["entrant1Score"];
            this.entrant2Score = _data["entrant2Score"];
            this.entrant1NextSetID = _data["entrant1NextSetID"];
            this.entrant2NextSetID = _data["entrant2NextSetID"];
            this.entrant1PrevSetID = _data["entrant1PrevSetID"];
            this.entrant2PrevSetID = _data["entrant2PrevSetID"];
            this.setFormat = _data["setFormat"];
            this.phaseID = _data["phaseID"];
            this.roundID = _data["roundID"];
            if (Array.isArray(_data["games"])) {
                this.games = [] as any;
                for (let item of _data["games"])
                    this.games!.push(Game.fromJS(item));
            }
            this.other = _data["other"];
        }
    }

    static fromJS(data: any): Set {
        data = typeof data === 'object' ? data : {};
        let result = new Set();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["setID"] = this.setID;
        data["entrant1ID"] = this.entrant1ID;
        data["entrant2ID"] = this.entrant2ID;
        data["status"] = this.status;
        data["entrant1Result"] = this.entrant1Result;
        data["entrant2Result"] = this.entrant2Result;
        data["entrant1Score"] = this.entrant1Score;
        data["entrant2Score"] = this.entrant2Score;
        data["entrant1NextSetID"] = this.entrant1NextSetID;
        data["entrant2NextSetID"] = this.entrant2NextSetID;
        data["entrant1PrevSetID"] = this.entrant1PrevSetID;
        data["entrant2PrevSetID"] = this.entrant2PrevSetID;
        data["setFormat"] = this.setFormat;
        data["phaseID"] = this.phaseID;
        data["roundID"] = this.roundID;
        if (Array.isArray(this.games)) {
            data["games"] = [];
            for (let item of this.games)
                data["games"].push(item.toJSON());
        }
        data["other"] = this.other;
        return data;
    }
}

/** Object representing a single set of the tournament. */
export interface ISet {
    /** String containing a unique identifier for this set (i.e. no two sets in the event's `sets` array should have the same setID). */
    setID: string;
    /** The entrantID of the first player in this match. */
    entrant1ID: string;
    /** The entrantID of the second player in this match. */
    entrant2ID: string;
    /** String representing the status of this set. If populated, must take one of the following values: 'completed' (if the set has finished), 'started' (if the set is currently in progress), or 'pending' (if the set has yet to start). */
    status: SetStatus;
    /** String representing the result of entrant 1 in this match. If populated, must equal either 'win', 'lose', 'draw', or 'dq'. In the case of 'dq', the player disqualified should be assigned the 'dq' result and the other player should be assigned the 'win' result. (If both players are disqualified, both should be assigned 'dq'). */
    entrant1Result: SetGameResult;
    /** String representing the result of entrant 2 in this match. If populated, must equal either 'win', 'lose', 'draw', or 'dq'. */
    entrant2Result: SetGameResult;
    /** Integer representing the score of entrant 1 in this match. */
    entrant1Score: number;
    /** Integer representing the score of entrant 2 in this match. */
    entrant2Score: number;
    /** The setID of the set that entrant 1 will play next. For a single-elim or double-elim tournament, setting this allows one for reconstruction of the original bracket. If entrant 1 does not play another set (e.g. they have won or are knocked out), do not set this field. */
    entrant1NextSetID: string;
    /** The setID of the set that entrant 2 will play next. For a double-elim tournament, setting this allows one for reconstruction of the original bracket. If entrant 2 does not play another set, do not set this field. */
    entrant2NextSetID: string;
    /** The setID of the set that entrant 1 played right before this set. If this is entrant 1's first set, do not set this field. */
    entrant1PrevSetID: string;
    /** The setID of the set that entrant 2 played right before this set. If this is entrant 2's first set, do not set this field. */
    entrant2PrevSetID: string;
    /** String representing format specific to this set (e.g. whether it was best of 3 or best of 5). */
    setFormat: string;
    /** String representing the `phase' of this specific set. It is up to the user's discretion to decide what precisely a phase means. For tournaments with multiple phases / levels (e.g. pools, top 64, top 8), it is convenient to record this information here. */
    phaseID: string;
    /** String representing the `round' in the bracket of this specific set (for example, "Winner's Round 1" or "Semifinals"). It is up to the user's discretion to decide what precisely a round means and how to record it. */
    roundID: string;
    /** Array of `Game` objects containing information about each game of this set. It is recommended (but not required) that this array records the games in chronological order. See the `Game` definition for more information. */
    games: Game[];
    /** Object that can be used to store any other relevant set-related information not covered by the previously mentioned fields. */
    other: any;
}

/** Object representing a single game of a set. */
export class Game implements IGame {
    /** Integer representing the number (in chronological order) of this game. The `gameNumber`s of the games of a set should be unique and span a consecutive range of integers starting at 1. */
    gameNumber!: number;
    /** Array of strings representing the character(s) played by entrant 1 in this game. If entrant 1 only plays a single character in this game (most cases), this field should contain an array containing a single string (entrant 1's character). In team games or games where each entrant can choose a selection of different characters, you should record these characters as separate elements of this field. */
    entrant1Characters!: string[];
    /** Array of strings representing the character(s) played by entrant 2 in this game. See also `entrant1Characters`. */
    entrant2Characters!: any[];
    /** String representing the stage this game was played on. */
    stage!: string;
    /** String representing the result of entrant 1. */
    entrant1Result!: SetGameResult;
    /** String representing the result of entrant 2. */
    entrant2Result!: SetGameResult;
    /** Object that can be used to store any other relevant game-related information not covered by the previously mentioned fields. */
    other!: any;

    constructor(data?: IGame) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.gameNumber = _data["gameNumber"];
            if (Array.isArray(_data["entrant1Characters"])) {
                this.entrant1Characters = [] as any;
                for (let item of _data["entrant1Characters"])
                    this.entrant1Characters!.push(item);
            }
            if (Array.isArray(_data["entrant2Characters"])) {
                this.entrant2Characters = [] as any;
                for (let item of _data["entrant2Characters"])
                    this.entrant2Characters!.push(item);
            }
            this.stage = _data["stage"];
            this.entrant1Result = _data["entrant1Result"];
            this.entrant2Result = _data["entrant2Result"];
            this.other = _data["other"];
        }
    }

    static fromJS(data: any): Game {
        data = typeof data === 'object' ? data : {};
        let result = new Game();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["gameNumber"] = this.gameNumber;
        if (Array.isArray(this.entrant1Characters)) {
            data["entrant1Characters"] = [];
            for (let item of this.entrant1Characters)
                data["entrant1Characters"].push(item);
        }
        if (Array.isArray(this.entrant2Characters)) {
            data["entrant2Characters"] = [];
            for (let item of this.entrant2Characters)
                data["entrant2Characters"].push(item);
        }
        data["stage"] = this.stage;
        data["entrant1Result"] = this.entrant1Result;
        data["entrant2Result"] = this.entrant2Result;
        data["other"] = this.other;
        return data;
    }
}

/** Object representing a single game of a set. */
export interface IGame {
    /** Integer representing the number (in chronological order) of this game. The `gameNumber`s of the games of a set should be unique and span a consecutive range of integers starting at 1. */
    gameNumber: number;
    /** Array of strings representing the character(s) played by entrant 1 in this game. If entrant 1 only plays a single character in this game (most cases), this field should contain an array containing a single string (entrant 1's character). In team games or games where each entrant can choose a selection of different characters, you should record these characters as separate elements of this field. */
    entrant1Characters: string[];
    /** Array of strings representing the character(s) played by entrant 2 in this game. See also `entrant1Characters`. */
    entrant2Characters: any[];
    /** String representing the stage this game was played on. */
    stage: string;
    /** String representing the result of entrant 1. */
    entrant1Result: SetGameResult;
    /** String representing the result of entrant 2. */
    entrant2Result: SetGameResult;
    /** Object that can be used to store any other relevant game-related information not covered by the previously mentioned fields. */
    other: any;
}

/** Object representing a single phase of a tournament (e.g. pools, top 64, etc.) Useful for recording tournaments with complex structures (e.g. round-robin pools into a double-elimination bracket). See the `phases` field in `Event` for more information. */
export class Phase implements IPhase {
    /** Unique string ID corresponding to this phase. */
    phaseID!: string;
    /** String representing the format of this tournament in this phase (e.g. single-elimination, double-elimination, etc.). See the `tournamentStructure` field in `Event` for more information. */
    phaseStructure!: string;
    /** Object that can be used to store any other relevant phase-related information not covered by the previously mentioned fields. */
    other!: any;

    constructor(data?: IPhase) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.phaseID = _data["phaseID"];
            this.phaseStructure = _data["phaseStructure"];
            this.other = _data["other"];
        }
    }

    static fromJS(data: any): Phase {
        data = typeof data === 'object' ? data : {};
        let result = new Phase();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["phaseID"] = this.phaseID;
        data["phaseStructure"] = this.phaseStructure;
        data["other"] = this.other;
        return data;
    }
}

/** Object representing a single phase of a tournament (e.g. pools, top 64, etc.) Useful for recording tournaments with complex structures (e.g. round-robin pools into a double-elimination bracket). See the `phases` field in `Event` for more information. */
export interface IPhase {
    /** Unique string ID corresponding to this phase. */
    phaseID: string;
    /** String representing the format of this tournament in this phase (e.g. single-elimination, double-elimination, etc.). See the `tournamentStructure` field in `Event` for more information. */
    phaseStructure: string;
    /** Object that can be used to store any other relevant phase-related information not covered by the previously mentioned fields. */
    other: any;
}

/** Root object: every OpenBracketFormat file should consist of exactly one `Tournament` object. */
export class Sample implements ISample {
    /** Object that contains metadata relevant to the entire tournament -- e.g. name and date of the event, tournament format, etc. See the `Event` definition for more information. */
    event!: Event;
    /** Unordered array of all sets that took place during this tournament. See the `Set` definition for more information. */
    sets!: Set[];
    /** Unordered array of all entrants in the tournament. See the `Entrant` definition for more information. */
    entrants!: Entrant[];
    /** Stores the version of the Open Bracket Format specification that this file was generated in accordance with. It is highly recommended (but not required) to include this field -- if this field is not set, the default assumption will be that the file was generated with the most recent version of OBF. The current version of the OBF format (what you are reading) is `v0.2`. */
    version!: SampleVersion;

    constructor(data?: ISample) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
        if (!data) {
            this.event = new Event();
            this.sets = [];
            this.entrants = [];
        }
    }

    init(_data?: any) {
        if (_data) {
            this.event = _data["event"] ? Event.fromJS(_data["event"]) : new Event();
            if (Array.isArray(_data["sets"])) {
                this.sets = [] as any;
                for (let item of _data["sets"])
                    this.sets!.push(Set.fromJS(item));
            }
            if (Array.isArray(_data["entrants"])) {
                this.entrants = [] as any;
                for (let item of _data["entrants"])
                    this.entrants!.push(Entrant.fromJS(item));
            }
            this.version = _data["version"];
        }
    }

    static fromJS(data: any): Sample {
        data = typeof data === 'object' ? data : {};
        let result = new Sample();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["event"] = this.event ? this.event.toJSON() : <any>undefined;
        if (Array.isArray(this.sets)) {
            data["sets"] = [];
            for (let item of this.sets)
                data["sets"].push(item.toJSON());
        }
        if (Array.isArray(this.entrants)) {
            data["entrants"] = [];
            for (let item of this.entrants)
                data["entrants"].push(item.toJSON());
        }
        data["version"] = this.version;
        return data;
    }
}

/** Root object: every OpenBracketFormat file should consist of exactly one `Tournament` object. */
export interface ISample {
    /** Object that contains metadata relevant to the entire tournament -- e.g. name and date of the event, tournament format, etc. See the `Event` definition for more information. */
    event: Event;
    /** Unordered array of all sets that took place during this tournament. See the `Set` definition for more information. */
    sets: Set[];
    /** Unordered array of all entrants in the tournament. See the `Entrant` definition for more information. */
    entrants: Entrant[];
    /** Stores the version of the Open Bracket Format specification that this file was generated in accordance with. It is highly recommended (but not required) to include this field -- if this field is not set, the default assumption will be that the file was generated with the most recent version of OBF. The current version of the OBF format (what you are reading) is `v0.2`. */
    version: SampleVersion;
}

export enum SetStatus {
    Completed = "completed",
    Started = "started",
    Pending = "pending",
}

export enum SampleVersion {
    V0_1 = "v0.1",
    V0_2 = "v0.2",
    V1_0 = "v1.0",
}

function formatDate(d: Date) {
    return d.getFullYear() + '-' +
        (d.getMonth() < 9 ? ('0' + (d.getMonth()+1)) : (d.getMonth()+1)) + '-' +
        (d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate());
}
