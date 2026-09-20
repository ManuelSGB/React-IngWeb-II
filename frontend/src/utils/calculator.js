export function calcularConsumo(potencia, horas) {
    const consumo = (Number(potencia) * Number(horas)) / 1000;
    const costo = consumo * 900;

    return { consumo, costo };
}