'use client'

import {createContext} from 'react'
import {IEntrant, IEvent, ISet, OBFEvent} from "../types/obf.ts";
import BracketEvent from "../utilities/obf-bracket-manager/BracketEvent.ts";
import BracketSet from "../utilities/obf-bracket-manager/BracketSet.ts";
import BracketEntrant from "../utilities/obf-bracket-manager/BracketEntrant.ts";
import {BracketViewerConfigs} from "../types/userSettings.ts";

export const EventContext = createContext(undefined as unknown as IEvent)
export const EventsContext = createContext(undefined as unknown as IEvent[])
export const EntrantContext = createContext(undefined as unknown as IEntrant)
export const EntrantsContext = createContext(undefined as unknown as IEntrant[])
export const SetContext = createContext(undefined as unknown as ISet)
export const SetsContext = createContext(undefined as unknown as ISet[])
export const OBFContext = createContext(undefined as unknown as OBFEvent)
export const BracketEventContext = createContext(undefined as unknown as BracketEvent)
export const BracketSetContext = createContext(undefined as unknown as BracketSet)
export const BracketEntrantContext = createContext(undefined as unknown as BracketEntrant)
export const BracketSetsContext = createContext(undefined as unknown as BracketSet[])
export const BracketViewerConfigsContext = createContext(undefined as unknown as BracketViewerConfigs)
