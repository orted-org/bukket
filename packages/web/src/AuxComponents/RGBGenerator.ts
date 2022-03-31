function RGBGenerator(text: string, opacity: number) {
    const ascii = text.toUpperCase().charCodeAt(0);
    const letter = ascii - 64;
    const credit = letter / 2;
    let r = 100, b = 100, g = 100;

    for (let i = 0; i < credit; i++) {
        if (r < 180) r += 40
        else if (g < 180) { g += 40; r -= 40 }
        else if (b < 180) { b += 40; g -= 40 } else {
            b -= 40;
        }
    }
    const color = `rgba(${r},${g},${b},${opacity})`;
    return color;
}
export default RGBGenerator