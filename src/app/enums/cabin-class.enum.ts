export enum CabinClass {
  ECONOMY = 'ECONOMY',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST'
}

export const CabinClassLabels: Record<CabinClass, string> = {
  [CabinClass.ECONOMY]: 'Ekonomiczna',
  [CabinClass.PREMIUM_ECONOMY]: 'Ekonomiczny Premium',
  [CabinClass.BUSINESS]: 'Biznesowa',
  [CabinClass.FIRST]: 'Pierwsza klasa'
}
