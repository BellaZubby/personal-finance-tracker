export const slideInFromLeft = (delay:number) => {
    return {
        hidden:{x: -100, opacity:0},
        visible: {
            x:0,
            opacity: 1,
            transition: {
                delay:delay,
                duration: 0.7,
            },
        },
    };
}

export const slideInFromRight = (delay:number) => {
    return {
        hidden: {x: 100, opacity: 0},
        visible: {
            x:0,
            opacity: 1,
            transition: {
                delay:delay,
                duration: 0.5,
            },
        },
    }
}

export const slideInFromTop = (delay:number) => {
    return {
        hidden: {y: -100, opacity: 0},
        visible: {
            y:0,
            opacity: 1,
            transition: {
                delay:delay,
                duration: 0.6,
            },
        },
    }
}

export const slideInFromBottom = (delay:number) => {
    return {
        hidden: {y: 100, opacity: 0},
        visible: {
            y:0,
            opacity: 1,
            transition: {
                delay:delay,
                duration: 0.5,
            },
        },
    }
}

export const fadeIn = (direction:string, delay:number) => {
    return {
      hidden: {
        y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
        opacity: 0,
        x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
        transition: {
          type: 'tween',
          duration: 1.5,
          delay: delay,
        //   ease: [0.25, 0.6, 0.3, 0.8] as [number, number, number, number], // 👈 cast explicitly
        },
      },
      visible: {
        y: 0,
        x: 0,
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 1.4,
          delay: delay,
        //   ease: [0.25, 0.25, 0.25, 0.75] as [number, number, number, number], // 👈 cast explicitly
        },
      },
    };
  };