export function generateTimesTableQuizProblem() {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const product = a * b;

    return {
        texInitial: `${a} \\times ${b} = \\_\\_\\_\\_`,
        texAnswer: `${a} \\times ${b} = ${product}`
    };
}

export function generateReferenceTables() {
    let tables = [];
    for (let i = 1; i <= 12; i++) {
        let tableStr = `\\begin{array}{c} \\textbf{${i}s} \\\\`;
        for (let j = 1; j <= 12; j++) {
            tableStr += `${i} \\times ${j} = ${i * j} \\\\`;
        }
        tableStr += `\\end{array}`;
        tables.push(tableStr);
    }
    return tables;
}
