async function fetchPoem(elementPoem, elementAuthor) {
    const len = Math.floor(Math.random() * 5) + 1;
    try {
        const r = await fetch("https://poetrydb.org/linecount/" + len);

        const d = await r.json();

        const randomIndex = Math.floor(Math.random() * d.length);
        const poemResult = d[randomIndex];

        elementPoem.innerHTML = `<em>${poemResult.lines.join("<br>")}</em>`;
        elementAuthor.innerHTML = `<p> - ${poemResult.author} (${poemResult.title})</p>`;
    } catch (e) {
        console.log(e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchPoem(
        document.getElementById("poem"),
        document.getElementById("author"),
    );
});
