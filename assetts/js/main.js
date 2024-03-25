const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'hymnPlayer';

const cd = $('.header--img');
const headerNameMusic = $('.header__name--music');
const headerImgMusic = $('.header--img');
const audio = $('#audio');
const playMusic = $('.header__control--play');
const playing = $('.js-play');
const progress = $('.js-progress');
const nextMusic = $('.js-control--next');
const prevMusic = $('.js-control--prev');
const repeatMusic = $('.js-control--repeat');
const randomMusic = $('.js-control--random');
const listMusic = $('.js-list-play');

const app = {
    currentIndex: 0,
    arrIndex: [],
    allArrIndex: [],
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    hymns: [
        {
            name: 'It was for Her',
            singer: 'NYCYPCD',
            path: './assetts/audio/It_was_for_Her.mp3',
            image: './assetts/img/It_was_for_Her.png'
        },
        {
            name: 'This Is the Year of Jubilee!',
            singer: 'NYCYPCD',
            path: './assetts/audio/This_Is_The_Year_Of_Jubilee.mp3',
            image: './assetts/img/This_Is_the_Year_of_Jubilee!.png'
        },
        {
            name: 'Jesus Lord, My Best Love Thou Art',
            singer: 'NYCYPCD',
            path: './assetts/audio/Jesus_Lord_My_Best_Love_Thou_Art.mp3',
            image: './assetts/img/Jesus_Lord_My_Best_Love_Thou_Art.png'
        },
        {
            name: 'Lord, You Love Me so Immensely',
            singer: 'NYCYPCD',
            path: './assetts/audio/Lord,_You_Love_Me_so_Immensely.mp3',
            image: './assetts/img/Lord_You_Love_Me_so_Immensely.png'
        },
        {
            name: 'How Sweet the Name of Jesus Sounds – Hymn 66',
            singer: 'NYCYPCD',
            path: './assetts/audio/How_Sweet_the_Name_of_Jesus_Sounds–Hymn_66.mp3',
            image: './assetts/img/This_Is_the_Year_of_Jubilee!.png'
        },
        {
            name: 'Pursue Him and Know Him',
            singer: 'NYCYPCD',
            path: './assetts/audio/Pursue_Him_and_Know_Him.mp3',
            image: './assetts/img/Pursue_Him_and_Know_Him.png'
        }
    ],
    render() {
        const htmls = this.hymns.map((hymn, index) => {
            return `  
                <div class="col col-12">
                    <div class="item-play js-item-play" data-index="${index}">
                        <img src="${hymn.image}" alt="" class="item-play--img">
                        <div class="item-play__info">
                            <h4 class="item-play__info--name">${hymn.name}</h4>
                            <p class="item-play__info--author">${hymn.singer}</p>
                        </div>
                        <i class="item-play--icon fa-solid fa-ellipsis"></i>
                    </div>
                </div>`;
        });

        listMusic.innerHTML = htmls.join('');
    },
    defineProperties() {
        Object.defineProperty(this, 'currentHymn', {
            get() {
                return this.hymns[this.currentIndex];
            }
        })
    },
    loadCurrentHymn() {
        headerNameMusic.innerText = this.currentHymn.name;
        headerImgMusic.src = this.currentHymn.image;
        audio.src = this.currentHymn.path;
        $$('.js-item-play').forEach((play, index) => {
            if (index === this.currentIndex) {
                play.classList.add('active');
            } else {
                play.classList.remove('active');
            }
        });
    },
    handleEvents() {
        // Xử lý CD quay
        let spinnerAnimation = headerImgMusic.animate(
            [
                { transform: 'rotate(359deg)' }
            ],
            {
                duration: 10000,
                iterations: Infinity
            }
        );
        spinnerAnimation.pause();

        // Xử lý phóng to thu nhỏ hình ảnh cd
        let offsetWidthCD = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newOffsetWidthCD = offsetWidthCD - scrollTop;
            cd.style.width = newOffsetWidthCD >= 0 ? newOffsetWidthCD + 'px' : 0;
            cd.style.opacity = newOffsetWidthCD / offsetWidthCD;
        };

        // Xử lý bật tắt cd
        let _this = this;
        playMusic.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // khi play
        audio.onplay = function () {
            _this.isPlaying = true;
            playing.classList.add('playing');
            spinnerAnimation.play();
        }

        // khi pause
        audio.onpause = function () {
            _this.isPlaying = false;
            playing.classList.remove('playing');
            spinnerAnimation.pause();
        }

        // Xử lý tiến độ bài hát khi thay đổi
        let progressPercent = 0;
        audio.ontimeupdate = () => {
            if (audio.duration) {
                progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // xử lý tua bài hát
        progress.onchange = (e) => {
            let seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        };

        // Xử lý khi kéo thanh nhạc (cd) thì không bị giật do tiến độ bài hát nữa
        let isDragging = false;
      
        progress.onmousedown = function() {
            isDragging = true;
        };

        progress.onmouseover = function() {
            if (isDragging) {
                audio.ontimeupdate = () => {};
            } else {
                audio.ontimeupdate = () => {
                    if (audio.duration) {
                        progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                        progress.value = progressPercent;
                    }
                };
            }
        };

        progress.onmouseup = function() {
            isDragging = false;
        };
        console.log([progress]);
        // progress.addEventListener("mousedown", () => isDragging = true);
        // progress.addEventListener("mouseup", () => isDragging = false);
        // progress.addEventListener("mousemove", function () {
        //     if (isDragging) {
        //         audio.ontimeupdate = () => { };
        //     } else {
        //         audio.ontimeupdate = () => {
        //             if (audio.duration) {
        //                 progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        //                 progress.value = progressPercent;
        //             }
        //         };
        //     }
        // });

        // xử lý chuyển bài hát tiếp theo
        nextMusic.onclick = () => _this.nextHymnPlay();

        // xử lý lùi bài hát phía sau
        prevMusic.onclick = () => _this.prevHymnPlay();

        // Xử lý tự động chuyển bài hát khi kết thúc
        audio.onended = () => _this.isRepeat ? audio.play() : _this.nextHymnPlay();

        // Xử lý lặp lại bài hát
        repeatMusic.addEventListener('click', () => {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatMusic.classList.toggle('active');
        });

        //Xử lý random bài hát
        randomMusic.addEventListener('click', () => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomMusic.classList.toggle('active');
        });

        // 
        listMusic.onclick = function(e) {
            let hymn = e.target.closest('.js-item-play:not(.active)');
            if (hymn || e.target.closest('.item-play--icon')) {
                if (e.target.closest('.item-play--icon')) {
                
                }

                if (hymn.closest('.js-item-play')) {
                    _this.currentIndex = parseInt(hymn.dataset.index);
                    _this.loadCurrentHymn();
                    audio.play();
                }
    
            }
        }
 
    },
    nextHymn() {
        this.currentIndex++;
        if (this.currentIndex > this.hymns.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentHymn();
    },
    prevHymn() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.hymns.length - 1;
        }
        this.loadCurrentHymn();
    },
    nextRandomHymn() {
        let newIndex = this.currentIndex;
        this.arrIndex.push(newIndex);
        this.allArrIndex.push(newIndex);
        if (this.arrIndex.length === this.hymns.length) {
            this.arrIndex = [];
        }
  
        while (newIndex === this.currentIndex || this.arrIndex.includes(newIndex)) {
            newIndex = Math.floor(Math.random() * this.hymns.length);
        }

        this.currentIndex = newIndex;
        console.log(this.arrIndex, this.allArrIndex);
        this.loadCurrentHymn();
  
    },
    prevRandomHymn() {
        this.allArrIndex.pop();
        console.log(this.allArrIndex);
        if (this.allArrIndex.length !== 0) {
            this.currentIndex = this.allArrIndex.at(-1);
            this.loadCurrentHymn();
        } else {
            this.loadCurrentHymn();
        }

    },
    nextHymnPlay() {
        if (this.isRandom) {
            this.nextRandomHymn();
        } else {
            this.arrIndex = [];
            this.allArrIndex = [];
            this.nextHymn();
        }

        audio.play();
        this.scrollToActiveHymn();

    },
    prevHymnPlay() {
        if (this.isRandom) {
            this.prevRandomHymn();
        } else {
            this.arrIndex = [];
            this.allArrIndex = [];
            this.prevHymn()
        }

        audio.play();
        this.scrollToActiveHymn();
    },
    scrollToActiveHymn() {
        setTimeout(() => {
            $('.js-item-play.active').scrollIntoView (
                {
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                }
            );
        },300);
    },
    loadConfig() {
        this.isRepeat = this.config.isRepeat;
        this.isRandom = this.config.isRandom;

        repeatMusic.classList.toggle('active', this.isRepeat);
        randomMusic.classList.toggle('active', this.isRandom);
    },
    start() {
        this.loadConfig();
        // Render playlist
        this.render();
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        // Hiển thị bài hát
        this.loadCurrentHymn();
        // Lắng nghe / xử lý các sự kiện (DOM Event)
        this.handleEvents();
        console.log(this.isRandom, this.arrIndex, this.allArrIndex);
    }
}
app.start();