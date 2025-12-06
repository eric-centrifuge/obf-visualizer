'use client'

import {createContext} from 'react'
import {IEntrant, IEvent, ISet} from "../types/obf.ts"
import {BracketViewerConfigs} from "../types/userSettings.ts"

export const EventContext = createContext(undefined as unknown as IEvent)
export const EntrantsContext = createContext(undefined as unknown as IEntrant[])
export const SetContext = createContext(undefined as unknown as ISet)
export const SetsContext = createContext(undefined as unknown as ISet[])
export const BracketViewerConfigsContext = createContext(undefined as unknown as BracketViewerConfigs)
