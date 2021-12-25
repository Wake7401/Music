const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Music';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const cdWidth = cd.offsetWidth;
const player = $('.player')
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')
const musicStartTime = $('.currentTime')
const musicDuration = $('.songduration')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: 'Bỏ túi',
            singer: 'B-wine & Vsoul',
            image: './assets/img/img1.jpg',
            path: './assets/music/VSOUL BWINE  Bỏ Túi Rap Việt mùa 2  AUDIO .mp3'
        }, {
            name: 'Tặng Một Món Quà',
            singer: 'Phaos & J Jade',
            image: './assets/img/img1.jpg',
            path: './assets/music/y2mate.com - Phaos VS J Jade  Tặng Một Món Quà  Team Wowy  Rap Việt  Mùa 2 MV Lyrics.mp3'
        }, {
            name: 'Ex\'s hate me',
            singer: 'Bray',
            image: './assets/img/img2.jpg',
            path: './assets/music/ExsHateMe.mp3'
        },
        {
            name: 'Nghe  Nói',
            singer: 'Pjpo & Obito',
            image: './assets/img/img1.jpg',
            path: './assets/music/y2mate.com - Pjpo VS Obito  Nghe  Nói  Team Binz  Rap Việt  Mùa 2 MV Lyrics.mp3'
        }, {
            name: '101520',
            singer: 'Sol7 & Pretty XIX',
            image: './assets/img/img1.jpg',
            path: './assets/music/y2mate.com - Sol7 VS Pretty XIX  101520  Team Binz  Rap Việt  Mùa 2 MV Lyrics.mp3'
        }, {
            name: 'Cho mình em',
            singer: 'Binz & Đen Vâu',
            image: './assets/img/img3.jpg',
            path: './assets/music/ChoMinhEm-Binz-6330310.mp3'
        },
        {
            name: 'Tầng Tầng Lớp Love',
            singer: 'Vsoul',
            image: './assets/img/img1.jpg',
            path: './assets/music/y2mate.com - Vsoul  Tầng Tầng Lớp Love  Team Rhymastic  Rap Việt  Mùa 2 MV Lyrics.mp3'
        },
        {
            name: '夜に駆ける',
            singer: 'YOASOBI',
            image: './assets/img/img4.png',
            path: './assets/music/YOASOBI夜に駆ける Official Music Video.mp3'
        }, {
            name: 'Lemon',
            singer: 'Kenshi Yonezu',
            image: './assets/img/5.jpg',
            path: './assets/music/Lemon.mp3'
        },

    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                            <div class="thumb" 
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
        })
        playlist.innerHTML = htmls.join('');
    },
    //Lấy ra bài hát đầu tiên
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {

        //Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Điều chỉnh kích thước của CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lí khi click play
        playBtn.onclick = function() {
            if (this.isPlaying) {
                this.isPlaying = false;
                audio.pause();
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            } else {
                this.isPlaying = true;
                audio.play();
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            this.timeCurrent()
            this.timeDuration()
        }

        // Xử lí khi tua bài hát 
        progress.oninput = function(e) {
            audio.pause()
            cdThumbAnimate.play()
            player.classList.add('playing');
            setTimeout(() => {
                audio.play();
            }, 500);
            const seekTime = e.target.value * (audio.duration / 100);
            audio.currentTime = seekTime;
        }

        //Khi next bài hát
        nextBtn.onclick = () => {
            if (this.isRandom) {
                this.playRandomSong()
            } else(
                this.nextSong()
            )
            player.classList.add('playing');
            audio.play()
            this.render()
            cdThumbAnimate.play()
            this.scrollToActiveSong()
        }
        prevBtn.onclick = () => {
            if (this.isRandom) {
                this.playRandomSong()
            } else {
                this.prevSong()
            }
            player.classList.add('playing');
            audio.play()
            this.render()
            cdThumbAnimate.play()
            this.scrollToActiveSong()
        }

        //Random bài hát
        randomBtn.onclick = (e) => {
            this.isRandom = !this.isRandom
            this.setConfig('isRandom', this.isRandom)
            randomBtn.classList.toggle('active', this.isRandom)
        }

        // Xử lí next bài hát khi kết thúc
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play()
            } else(
                nextBtn.click()
            )
        }

        // Xử lí lặp lại bài hát
        repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat
            this.setConfig('isRepeat', this.isRepeat)
            repeatBtn.classList.toggle('active', this.isRepeat)
        }

        //Lắng nghe hành vi click vào danh sách bài hát
        playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                //Xử lí khi click vào bài hát
                if (songNode) {
                    this.currentIndex = Number(songNode.dataset.index)
                    this.loadCurrentSong()
                    audio.play()
                    this.render()
                    cdThumbAnimate.play()
                    player.classList.add('playing');
                }
                //
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex > this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong();
    },
    formatTime: function(sec_num) {
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - hours * 3600) / 60);
        let seconds = Math.floor(sec_num - hours * 3600 - minutes * 60);

        hours = hours < 10 ? (hours > 0 ? '0' + hours : 0) : hours;

        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds;
    },
    // hiển thị thời gian bài hát hiện tại
    timeCurrent: function() {
        setInterval(() => {
            let cur = this.formatTime(audio.currentTime)
            musicStartTime.textContent = `${cur}`;
        }, 100)
    },
    //hiển thị thời gian bài hát
    timeDuration: function() {
        if (audio.duration) {
            let dur = this.formatTime(audio.duration)
            musicDuration.textContent = `${dur}`;
        }
    },
    playRandomSong: function() {
        let checkIndex = [0]
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (checkIndex.includes(newIndex) && checkIndex.length < this.songs.length)
        if (checkIndex.length < this.songs.length) {
            checkIndex.push(newIndex)
        } else {
            checkIndex = [this.currentIndex, newIndex]
        }
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            if (this.currentIndex < 2) {
                const scrollSong = $('.song.active')
                scrollSong.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                })
            } else {
                const scrollSong = $('.song.active')
                scrollSong.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }
        }, 300)
    },
    start: function() {
        //Gán cấu hình từ config vào ứng dụng bài hát
        this.loadConfig()

        //Định nghĩa các thuộc tính cho Oject
        this.defineProperties();

        //Lắng nghe / xử lý sự kiện trong DOM event
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();
        // Hiển thị trạng thái ban đầu của button repeat và radom 
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}
app.start();