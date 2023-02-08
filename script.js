window.onload = function(){

    let url = "https://gist.githubusercontent.com/samano2j/6d7a63d7a04cde3f5b6fa7c38718d25d/raw/f7c6ca94d832e67cdd4942a58ee335579d1d9698/figures.json"

    let imgName = [];
    let imgPrice = [];
    let subTotal = 0;
    let itemsCart = 0;

    fetchPosts();

    //Get Images
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

                $('#listImg').append(newImg)
            }
        }
    }
    
    //Close Modal
    $(".closeModal").click(function() {
        $('.modal').css({"display":"none"})
        $('body').css({"overflow-y":"scroll"})
    })

    //Show Modal
    $('#listImg').click(function(e){
        if($(e.target).is('img')) {
            $('.modal').css({"display":"grid"})
            let imgSrc = $(e.target).attr('src')
            $('#modal-img').attr('src',`${imgSrc}`)

            let num = e.target.id;
            $('#nameModal').text(imgName[num.replace(/\D/g, '') - 1]);
            $('#priceModal').text(imgPrice[num.replace(/\D/g, '') - 1]);

            $('body').css({"overflow":"hidden"})
        }

        if($(e.target).is('div')) {
            let imgSrc = $(e.target).parent().prev().attr('src')
            $('.modal').css({"display":"grid"})
            $('#modal-img').attr('src',`${imgSrc}`)

            let num = $(e.target).parent().prev().attr('id')
            $('#nameModal').text(imgName[num.replace(/\D/g, '') - 1]);
            $('#priceModal').text(imgPrice[num.replace(/\D/g, '') - 1]);

            $('body').css({"overflow":"hidden"})
        }
    })

    //Show Checkout List
    $('header nav').click(function(e) { 
        if(e.target.id == 'cartNav') {
            $('.checkout-list').css({"display":"block"});
            $('body').css({"overflow":"hidden"})
            $('.checkout-container').animate({width:"+=40%"},300);

        }
    })

    //Close Checkout List
    $('#closeCheckout').click(function(e) {
        $('.checkout-container').animate({width:"-=40%"});
        setTimeout(() => {
            $('.checkout-list').css({"display":"none"},300);
            $('body').css({"overflow-y":"scroll"})
        }, "300")

    }) 

    //Add Item to Cart
    $('#addCart').click(function(e) {
        let nameImg = $(e.target).prev().prev()
        let id = 0
        imgName.forEach(function(name, i){
            if(name == nameImg.text()) {
                id = i
            }
        })

        let listItem = $("#checkout-items-list").children()
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
                <i id="trash" class="bi bi-trash-fill"></i>
                <p id="multipleItem">Quantity: 1</p>
                <p id="priceCheckOut">${imgPrice[id]}</p>
                `
            $("#checkout-items-list").append(addItem)
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
        $('body').css({"overflow-y":"scroll"})
    })

    //Delete an Item from Checkout
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

    //Clear all Items from Checkout
    $('#clearBtn').click(function(e) {
        $('#checkout-items-list').children().remove()
        subTotal = 0
        itemsCart = 0
        $('#subtotal').text(`$${subTotal}`)
        $('#cartNav').text(`(${itemsCart})`)
        $('#cartOut').text(`(${itemsCart})`)
    })

    //Switch Hero Image
    $('#bg1').click(function(e) {
        $('.headline').css({"background-image":"url(/images/background/bg1.png)"})
        $('.bi-circle-fill').css({"color":"white"})
        $('#bg1').css({"color":"#ffce00"})
    })

    $('#bg2').click(function(e) {
        $('.headline').css({"background-image":"url(/images/background/bg2.png)"})
        $('.bi-circle-fill').css({"color":"white"})
        $('#bg1').css({"color":"white"})
        $('#bg2').css({"color":"#ffce00"})
    })

    $('#bg3').click(function(e) {
        $('.headline').css({"background-image":"url(/images/background/bg3.png)"})
        $('.bi-circle-fill').css({"color":"white"})
        $('#bg3').css({"color":"#ffce00"})
    })

    $('#bg4').click(function(e) {
        $('.headline').css({"background-image":"url(/images/background/bg4.png)"})
        $('.bi-circle-fill').css({"color":"white"})
        $('#bg4').css({"color":"#ffce00"})
    })

    setInterval(function () {
        let currBG = $('.headline').css("background-image")
        let numBG = parseInt(currBG.replace(/\D/g, '').at(-1))

        if(numBG == 4) {
            numBG = 1
        }
        else {
            numBG++
        }

        $('.headline').css({"background-image":`url(/images/background/bg${numBG}.png)`})
        $('.bi-circle-fill').css({"color":"white"})
        $(`#bg${numBG}`).css({"color":"#ffce00"})

    }, 3000);

    //Show/Hide Navbar when Scrolling
    let prevScrollpos = window.pageYOffset;
    $(window).scroll(function() {
        let currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
            $('header nav').css({"height":"10vh"})
        } 
        else {
            $('header nav').css({"height":"0"})
        }

        prevScrollpos = currentScrollPos;
    })

    //Switch Gallery View
    $('#gridView').click(function() {
        $('#listImg').css(
            {"display":"grid"}
        )
    })

    $('#flexView').click(function() {
        $('#listImg').css(
            {"display":"flex"}
        )
    })

};
