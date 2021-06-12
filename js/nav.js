document.addEventListener("DOMContentLoaded", function () {
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        const xHttp = new XMLHttpRequest();
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                // muat penampung menu-menu navigasi
                document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                    elm.innerHTML = xHttp.responseText;
                });

                // handle saat menu navigasi diklik
                document.querySelectorAll(".topnav a, .sidenav a").forEach(function (elm) {
                    elm.addEventListener("click", function (event) {
                        // tutup nav collapse
                        const sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        const page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
            }
        }
        xHttp.open("GET", "nav.html", true);
        xHttp.send();
    }

    // load page content
    let page = window.location.hash.substr(1);
    const pagesUrl = ["home", "classes", "maps", "contact"];
    if (page == "" || !pagesUrl.includes(page)) page = "home";
    loadPage(page);

    function loadPage(page) {
        const xHttp = new XMLHttpRequest();
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                const contentElems = document.querySelector("#body-content");
                if (this.status == 200) {
                    contentElems.innerHTML = xHttp.responseText;

                    // mendaftarkan modal hanya pada saat halaman class diakses
                    if (page == "classes") {
                        const modalElems = document.querySelectorAll(".modal");
                        M.Modal.init(modalElems);

                        const classList = document.querySelectorAll(".selectClass");
                        classList.forEach(function (classElm) {
                            classElm.addEventListener("click", function () {
                                const classSelected = this.dataset.class;
                                loadClass(classSelected);
                            })
                        });
                    }

                    // mendaftarkan fitur materialboxed/lightbox hanya saat halaman maps diakses
                    if (page == "maps") {
                        const materialboxedElms = document.querySelectorAll(".materialboxed");
                        M.Materialbox.init(materialboxedElms);
                    }
                } else if (this.status == 404) {
                    contentElems.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                } else {
                    contentElems.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                }
            }
        }
        xHttp.open("GET", "/pages/" + page + ".html", true);
        xHttp.send();
    }

    // ajax untuk tampilkan detail class berdasarkan yang diklik
    function loadClass(classSelected) {
        const xHttp = new XMLHttpRequest();
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status != 200) return;

                const results = JSON.parse(xHttp.responseText);
                const selectedClass = results.filter(function (data) {
                    return data.nama_class === classSelected;
                });

                // tempel data hasil json ke modal
                document.querySelector("#modalDetailClass .heading").innerHTML = "Detail Class " + selectedClass[0].nama_class;
                document.querySelector("#modalDetailClass .deskripsi").innerHTML = selectedClass[0].deskripsi;
                document.querySelector("#modalDetailClass .img-container").innerHTML = `<img src="${selectedClass[0].ilustrasi}" alt="Class Warrior" class="responsive-img">`;
                let str_second_class = "";
                selectedClass[0].second_class.forEach(function (second_class) {
                    str_second_class += `<li>
                        <p><strong>${second_class.nama_class}</strong></p>
                        <p>${second_class.deskripsi}</p>
                    </li>`;
                });
                document.querySelector("#modalDetailClass .list-second-class").innerHTML = str_second_class;
            }
        }
        xHttp.open("GET", '/assets/data/classes.json', true);
        xHttp.send();
    }
});