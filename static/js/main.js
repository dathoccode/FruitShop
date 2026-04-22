(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });

})(jQuery);

const formatVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const SHIP_FEE = 30000;

function logout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.clear();
        alert("Đã đăng xuất!");
        window.location.href = "http://127.0.0.1:5500/templates/login.html";
    }
}

function validateLogin(){
    var token = localStorage.getItem("token");

    if(!token || token == null) {
        window.location.href = "/templates/login.html";
    }
    else
    {
        $.ajax({
            url: "http://127.0.0.1:5000/account/getInfor",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function(res){
                $("#login-btn").html(
                `<i class="fas fa-user fa-2x"></i>
                <span class="d-none d-md-inline ms-1 small text-dark">
                    ${res.name}
                </span>`
                );
                updateCartQuantityIcon();
            },
            error: function(e){
                window.location.href = "/templates/login.html";
            }
        });
    }
}

function updateCartQuantityIcon(){
    var token = localStorage.getItem("token");

    $.ajax({
        url: "http://127.0.0.1:5000/cart/getProductAmount",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        contentType: "application/json",
        success: function(res){
            $('#cart-amount').html(res.amount);
        },
        error: function(e){
            $('#cart-amount').html(-1);
            alert("update cart amount icon failed");
        }
    });
}


function logout(token){
    $.ajax({
        url: "http://127.0.0.1:5000/logout",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        contentType: "application/json",
        success: function(res){
            window.location.href = "/templates/login.html";
            alert("log out success", res.message);
            localStorage.removeItem("token");
        },
        error: function(e){
            alert("logout failed");
        }
    });
}

$(document).on("click", ".btn-login", function(){
    const token = localStorage.getItem("token");
    if (token != null){
        Logout(token);
    }
    else{
        window.location.href = "/templates/login.html";
    }
});

// 3. Khởi tạo
$(document).ready(function () {
    // loadProducts();
    validateLogin();
});