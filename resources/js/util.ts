const wholes = (r: number, group: number) => (r - r % group) / group

const numeralI = (ones: number) => {
  switch (ones) {
    case 0: return ''
    case 1: return 'I'
    case 2: return 'II'
    case 3: return 'III'
    case 4: return 'IV'
    default: return `${ones}xI`
  }
}
const numeralV = (fives: number) => {
  switch (fives) {
    case 0: return ''
    case 1: return 'V'
    default: return `${fives}xV`
  }
}
const numeralX = (tens: number) => {
  switch (tens) {
    case 0: return ''
    case 1: return 'X'
    case 2: return 'XX'
    case 3: return 'XX'
    case 4: return 'XD'
    default: return `${tens}xX`
  }
}

export const romanNumeral = (v: number): string => {
  if (isNaN(v)) {
    return 'NaN'
  }

  let r = v
  const tens = wholes(r, 10)
  r -= tens * 10
  const fives = wholes(r, 5)
  r -= fives * 5
  const ones = r

  return `${numeralX(tens)}${numeralV(fives)}${numeralI(ones)}`
}
