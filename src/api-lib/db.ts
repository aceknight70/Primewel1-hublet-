import {
  INITIAL_CLIENTS,
  INITIAL_STAFF,
  INITIAL_AFFILIATES,
  INITIAL_PILOT_BUSINESSES,
  INITIAL_SKIN_CONFIGS,
  INITIAL_REDEMPTIONS,
  INITIAL_RESPONSE_WATCH_CASES,
} from '../data/mockData.js'; // Must use .js in node esm unless ts-node is handling it, but let's use what we had
import { AffhubAffiliate, AffhubClient, AffhubStaff, PromoRedemption, ResponseWatchCase } from '../types.js';

class AffhubDatabase {
  clients: AffhubClient[] = [...INITIAL_CLIENTS];
  staff: AffhubStaff[] = [...INITIAL_STAFF];
  affiliates: AffhubAffiliate[] = [...INITIAL_AFFILIATES];
  pilotBusinesses = [...INITIAL_PILOT_BUSINESSES];
  skinConfigs = [...INITIAL_SKIN_CONFIGS];
  redemptions: PromoRedemption[] = [...INITIAL_REDEMPTIONS];
  responseWatchCases: ResponseWatchCase[] = [...INITIAL_RESPONSE_WATCH_CASES];

  currentAuthUser: AffhubStaff = INITIAL_STAFF[0]; // default to Master, can switch

  // RLS-simulating getters...
  getAffiliatesForStaff(user: AffhubStaff) {
    if (user.role === 'master') return this.affiliates;
    if (user.role === 'manager') return this.affiliates.filter(a => a.clientId === user.clientId);
    return this.affiliates.filter(a => a.id === user.affiliateId);
  }

  getRedemptionsForStaff(user: AffhubStaff, skinSlugFilter?: string) {
    let list = this.redemptions;
    if (user.role === 'master') {
      if (skinSlugFilter) {
        const client = this.clients.find(c => c.slug === skinSlugFilter);
        if (client) list = list.filter(r => r.clientId === client.id);
      }
      return list;
    }
    if (user.role === 'manager') return list.filter(r => r.clientId === user.clientId);
    return list.filter(r => r.affiliateId === user.affiliateId);
  }

  getResponseWatchForStaff(user: AffhubStaff, skinSlugFilter?: string) {
    let list = this.responseWatchCases;
    if (user.role === 'master') {
      if (skinSlugFilter) {
        const client = this.clients.find(c => c.slug === skinSlugFilter);
        if (client) list = list.filter(r => r.clientId === client.id);
      }
      return list;
    }
    if (user.role === 'manager') return list.filter(r => r.clientId === user.clientId);
    return list.filter(r => r.affiliateId === user.affiliateId);
  }
}

export const db = new AffhubDatabase();
