function stopLoadingAnimation(){
    document.querySelector(".loader").hidden = true
}

function startLoadingAnimation(){
    document.querySelector(".loader").hidden = false
}


document.querySelector("#filter").addEventListener("change", async () => {
    const type = document.querySelector("#filter").value
    try {
        startLoadingAnimation()
        const res = await fetch(`/filterServices/${type}`)
        const services = await res.json()
        document.querySelector(".services").innerHTML = ''
        for(let i = 0; i < services.length; i++) {
            const newServicediv = document.createElement("div")
            const newServiceh2 = document.createElement("h2")
            newServiceh2.textContent = services[i].name
            newServiceh2.classList.add("section-title")
            const newServicep = document.createElement("p")
            newServicep.textContent = services[i].price
            // const newServicep2 = document.createElement("p")
            // newServicep2.textContent = services[i].description
            newServicediv.appendChild(newServiceh2)
            newServicediv.appendChild(newServicep)
            // newServicediv.appendChild(newServicep2)
            newServicediv.classList.add("card_")
            const anchor = document.createElement("a")
            anchor.setAttribute("href", `/moreInfo/${services[i].type}/${services[i]._id}`)
            // console.log(`/moreInfo/:${services[i].type}/:${services[i]._id}`)
            const seeMore = document.createElement("button")
            seeMore.textContent = "Detalii."
            seeMore.classList.add("button-black")
            anchor.appendChild(seeMore)
            newServicediv.appendChild(anchor)
            document.querySelector(".services").appendChild(newServicediv)

        }
        stopLoadingAnimation()
    }catch(err){
        console.log(err)
    }
})