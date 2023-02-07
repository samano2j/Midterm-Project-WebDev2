window.onload = function(){ 
    let url = "https://gist.githubusercontent.com/samano2j/6d7a63d7a04cde3f5b6fa7c38718d25d/raw/495a3c78843c94ba9f0d5e7c86baf4dc4276ccfb/figures.json"
    const listImg = document.querySelector("#listImg")
    let imgName = [];
    let imgPrice = [];
    let subTotal = 0;
    let itemsCart = 0;

    async function sendHttpRequest(method, url){
        const { data } = await axios(url, { method })
        return data
    }
    
    async function fetchPosts() {
        const response = await sendHttpRequest("GET", url)
        if(response.length > 0){
            for(const image of response){
                const newImg = document.createElement('li')
                newImg.innerHTML = `
                <img id="img${image['id']}" src="${image['location']}">
                <div class="overlay">
                <div class="text">${image['name']}<br>${image['price']}</div>
                </div>
                `

                imgName.push(image['name'])
                imgPrice.push(image['price'])

                listImg.appendChild(newImg)
            }
        }
    }

    fetchPosts();

    var modal = document.getElementById("confirmModal");
    var modalImg = document.getElementById("modal-img");


    var test = document.querySelector(".closetest");
    test.addEventListener('click', function(e) {
          modal.style.display = "none";
          $('body').css({"overflow":"scroll"})
    }) 


    $('#listImg').click(function(e){
        if($(e.target).is('img')) {
            $('.modal').css({"display":"grid"})
            modalImg.src = e.target.src;

            let num = e.target.id;
            $('#nameModal').text(imgName[num.replace(/\D/g, '') - 1]);
            $('#priceModal').text(imgPrice[num.replace(/\D/g, '') - 1]);

            $('body').css({"overflow":"hidden"})
        }

        if($(e.target).is('div')) {
            let imgSrc = $(e.target).parent().prev().attr('src')
            $('.modal').css({"display":"grid"})
            modalImg.src = imgSrc;

            let num = $(e.target).parent().prev().attr('id')
            $('#nameModal').text(imgName[num.replace(/\D/g, '') - 1]);
            $('#priceModal').text(imgPrice[num.replace(/\D/g, '') - 1]);

            $('body').css({"overflow":"hidden"})
        }
    })

    $('header nav').click(function(e) { 
        if(e.target.id == 'cartNav') {
            $('.checkout-list').css({"display":"block"});
            $('body').css({"overflow":"hidden"})
        }
    })

    $('#closeCheckout').click(function(e) {
        $('.checkout-list').css({"display":"none"});
        $('body').css({"overflow":"scroll"})
    }) 

    const checkoutList = document.querySelector("#checkout-items-list")

    $('#addCart').click(function(e) {
        let nameImg = $(e.target).prev().prev()
        let id = 0
        imgName.forEach(function(name, i){
            if(name == nameImg.text()) {
                id = i
            }
        })

        let listItem = $(checkoutList).children()
        let match = false

        listItem.map((key, value) => {
            let nameItem = $(value).children()
            if ($(nameItem[1]).text() == imgName[id]) {
                match = true
            }
        });

        if (match) {
            listItem.map((key, value) => {
                let nameItem = $(value).children()
                if ($(nameItem[1]).text() == imgName[id]) {
                    let quantity = $(nameItem[3]).text()
                    let numQuantity = parseInt(quantity.replace(/\D/g, ''))
                    numQuantity++
                    $(nameItem[3]).text(`Quantity: ${numQuantity}`)
                    
                    let newPrice = parseInt(imgPrice[id].replace(/\D/g, '')) * numQuantity
                    $(nameItem[4]).text(`$${newPrice}`)
                }
            });
        }
        else {
            const addItem = document.createElement('li')
            addItem.innerHTML = `
                <img src="/images/figures/figure${id + 1}.png">
                <p id="nameCheckOut">${imgName[id]}</p>
                <i class="bi bi-trash-fill"></i>
                <p id="multipleItem">Quantity: 1</p>
                <p id="priceCheckOut">${imgPrice[id]}</p>
                `
            checkoutList.appendChild(addItem)
        }

        if(subTotal == 0) {
            subTotal = parseInt(imgPrice[id].replace(/\D/g, ''))
        }
        else {
            subTotal += parseInt(imgPrice[id].replace(/\D/g, ''))

        }

        $('#subtotal').text(`$${subTotal}`)

        itemsCart++

        $('#cartNav').text(`(${itemsCart})`)
        $('#cartOut').text(`(${itemsCart})`)

        $('#confirmModal').css({"display":"none"})
        $('body').css({"overflow":"scroll"})
    })

    $('#checkout-items-list').click(function(e) {
        if(e.target.classList[1] === 'bi-trash-fill'){
            let price = $(e.target).next().next().text()
            let quantity = $(e.target).next().text()

            subTotal -= parseInt(price.replace(/\D/g, ''))
            $('#subtotal').text(`$${subTotal}`)

            itemsCart -= parseInt(quantity.replace(/\D/g, ''))
            $('#cartNav').text(`(${itemsCart})`)
            $('#cartOut').text(`(${itemsCart})`)
            $(e.target).parent().remove()
        }
    })

    $('#clearBtn').click(function(e) {
        $('#checkout-items-list').children().remove()
        subTotal = 0
        itemsCart = 0
        $('#subtotal').text(`$${subTotal}`)
        $('#cartNav').text(`(${itemsCart})`)
        $('#cartOut').text(`(${itemsCart})`)
    })
};
