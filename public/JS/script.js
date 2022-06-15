(function(){
    function stopLoadingAnimation(){
        document.querySelector(".loader").hidden = true
    }
    setTimeout(() => {
        stopLoadingAnimation()
    }, 1000)

})()