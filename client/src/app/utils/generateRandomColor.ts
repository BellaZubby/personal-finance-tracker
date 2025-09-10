export const generateRandomColor = ():string => {
    // const combinations = "ABCDEF0123456789";
    // let color = "#";

    // for(let i = 0; i < 6; i++ ) {
    //     color+= combinations[Math.floor(Math.random() * 16)]; // generate a random number (index) betwee 0 and 15. its corresponding value is added to the color inital value
    // }
    // return color;
    // Ensures only dark colors are generated
    const r = Math.floor(Math.random() * 100); // 0–99
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
}

// console.log(generateRandomColor());