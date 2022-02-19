const defaultTransitionTime = 1

function buildInlineTransformString (
  first: DOMRect,
  last: DOMRect,
  startingTransforms: { [index: string]: string },
): string {
  let xInvert = first.x - last.x
  let yInvert = first.y - last.y

  let startingTransformsString = ''

  Object.keys(startingTransforms).forEach(propertyName => {
    if (propertyName === 'translateX') {
      xInvert += Number(startingTransforms[propertyName])
    } else if (propertyName === 'translateY') {
      yInvert += Number(startingTransforms[propertyName])
    } else {
      startingTransformsString += `${propertyName}(${startingTransforms[propertyName]}) `
    }
  })

  const result = `translateX(${xInvert}px) translateY(${yInvert}px) ${startingTransformsString}`
  return result
}

function calculateTransitionTime (
  first: DOMRect,
  last: DOMRect,
  speed: number | undefined, time: number | undefined
): number {
  if (typeof time === 'number') {
    return time
  }
  if (typeof speed === 'number' && speed !== 0) {
    const xDistance = first.x - last.x
    const yDistance = first.y - last.y
    const distance = Math.sqrt((xDistance ** 2) + (yDistance ** 2))
    return Number((distance / speed).toPrecision(2))
  }
  return defaultTransitionTime
}

async function animatedElementMove (
  element: HTMLElement,
  moveFunction: Function,
  config: {
    time?: number, speed?: number,
    startingTransforms?: { [index: string]: string },
    endingClasses?: { [index: string]: boolean },
    zIndexDuringMove?: number
  } = {}
): Promise<HTMLElement> {
  const { startingTransforms = {}, endingClasses = {}, time, speed, zIndexDuringMove = 10 } = config

  const first = element.getBoundingClientRect()
  await moveFunction()
  const last = element.getBoundingClientRect()

  element.style.transition = 'none'
  element.style.zIndex = zIndexDuringMove.toString()
  element.style.transform = buildInlineTransformString(first, last, startingTransforms)

  return new Promise(resolve => {
    element.addEventListener('transitionend',
      () => {
        element.style.transform = ''
        element.style.transition = ''
        element.style.zIndex = ''
        resolve(element)
      }, { once: true })

    requestAnimationFrame(() => {
      element.style.transition = `transform ${calculateTransitionTime(first, last, speed, time)}s`
      element.style.transform = ''

      Object.keys(endingClasses).forEach(className => {
        if (endingClasses[className] === true) {
          element.classList.add(className)
        } else {
          element.classList.remove(className)
        }
      })
    })
  })
}

export { animatedElementMove }
