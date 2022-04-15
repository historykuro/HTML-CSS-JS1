const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const heading = $('header h2')
const audio = $("#audio")
const btnPlay = $(".btn-toggle-play")
const player = $(".player")
const btnNext = $(".btn-next")
const btnPrev = $(".btn-prev")
const timeUpdate = $("#progress")
const btnRandom = $(".btn-random")
const btnRepeat = $(".btn-repeat")
const playList = $(".playlist")
const PLAYER_STORAGE_KEY = "Input"
const volume = $("#volume")
const app = {
        songs: [
            {
                name: "Abcdefu",
                singer: "Gayle",
                path: './music/Abcdefu-GAYLE-7124987.mp3',
                image: './image/maxresdefault.jpg'
            },
            {
                name: "Believer",
                singer: "Imagine Dragons",
                path: './music/Believe.mp3',
                image: './image/download.jpg'
            },
            {
                name: "Payphone",
                singer: "Imagine Dragons",
                path: './music/Payphone.mp3',
                image: './image/payphone.jpg'
            },
            {
                name: "Co nhu khong co",
                singer: "Hien ho",
                path: './music/Co Nhu Khong Co - Hien Ho.mp3',
                image: './image/conhukhongco.jpg'
            },
            {
                name: "Demons",
                singer: "Imagine Dragons",
                path: './music/Demons-ImagineDragons_54df.mp3',
                image: './image/demon.jpg'
            },
            {
                name: "Don Let Me Down",
                singer: "TheChainsmokers",
                path: './music/DontLetMeDown-TheChainsmokersDaya-5817744.mp3',
                image: './image/dontletmedown.jpg'
            },         
            {
                name: "I hate U, I love U",
                singer: "Gnash_olivia",
                path: './music/I Hate U I Love U - Gnash_ Olivia O_Brie.mp3',
                image: './image/ihateyouiloveyou.jpg'
            },
            {
                name: "WithoutMe",
                singer: "Halsey",
                path: './music/WithoutMe-Halsey-5693781.mp3',
                image: './image/withoutme.jpg'
            },
            
        ],
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        currentIndex: 0,
        setConfig: function(key, value){
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
        },  
        render: function(){
            const _this = this
            const htmls = this.songs.map(function(song, index){
                return `
                        <div class="song ${index === _this.currentIndex ? "active" : ""}" data-index="${index}">
                        <div class="thumb" style="background-image: url(${song.image})">
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
            $('.playlist').innerHTML = htmls.join('')
        },
        defineProperties: function(){
            Object.defineProperty(this, 'currentSong', {
                get: function(){
                    return this.songs[this.currentIndex]
                }
            })
        },
        loadCurrentSong: function(){
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path   
            
        },
        handleEvents: function(){
            const _this = this
            const cdWidth = cd.offsetWidth
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ],{
                duration: 10000,
                iterations: Infinity
            })
            cdThumbAnimate.pause()
            //handle phong to va thu nho
            document.onscroll = function(){
                const scroll = window.scrollY || document.documentElement.scrollTop
                const newWidth = cdWidth - scroll
                cd.style.width = newWidth > 0  ? newWidth + "px" : 0
                cd.style.opacity = newWidth > 0 ? newWidth / cdWidth : 0
            }
        
            //handle Click play
            btnPlay.addEventListener('click', function(){
                if(_this.isPlaying){
                    audio.pause()
                }else{
                    audio.play()
                    
                }
            })
            // handle event controls
            audio.onplay= function(){
                _this.isPlaying = true
                player.classList.add("playing")
                cdThumbAnimate.play()
            }
            audio.onpause = function(){
                _this.isPlaying = false
                player.classList.remove("playing")
                cdThumbAnimate.pause()
            }
            audio.ontimeupdate = function(e){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    timeUpdate.value = progressPercent
                    console.log(timeUpdate.value = audio.currentTime  / audio.duration * 100)
                }
            }
            timeUpdate.oninput = function(e){
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime 
            }
            //handle next songs
            btnNext.addEventListener('click', function(){
                if(_this.isRandom){
                    _this.randomSongs()
                }else{
                    _this.nextSongs()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            })
            btnPrev.addEventListener('click', function(){
                
                if(_this.isRandom){
                    _this.randomSongs()
                }else{
                    _this.prevSongs()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()

            })
           
            btnRandom.addEventListener("click", function(){
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom' , _this.isRandom)
                btnRandom.classList.toggle('active', _this.isRandom)
            
            })
            btnRepeat.addEventListener('click',  function(){
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat', _this.isRepeat)
                this.classList.toggle('active', _this.isRepeat)

            })
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play()
                }else{
                    btnNext.click()
                }
            }
            playList.addEventListener("click", function(e){
                const songNode = e.target.closest(".song:not(.active)")
                if(songNode || e.target.closest(".option")){
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()
                    }
                }
            })
        },
        scrollToActiveSong: function(){
            setTimeout(() => {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                })
            }, 300);
        },
        prevSongs: function(){
            // this.currentIndex-- <= 0 ? 0 : this.currentIndex--
            this.currentIndex <= 0 ? this.currentSong = this.songs.length-1 : this.currentIndex--
            this.loadCurrentSong()
        },
        nextSongs: function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length){
                this.currentSong = 0 
            }
            this.loadCurrentSong()
        },
        randomSongs: function(){
            // this.currentIndex = Math.random()
            let newIndex
            do{
                newIndex = Math.floor(Math.random() * this.songs.length)
            } while(newIndex === this.currentIndex)
            
            this.currentIndex = newIndex
            this.loadCurrentSong()
        },
        loadConfig: function(){
            this.isRandom = this.config.random
            this.isRepeat = this.config.isRepeat
        },
        start: function(){
            this.loadConfig()
            this.defineProperties()
            this.render()
            this.handleEvents()
            this.loadCurrentSong()
            // this.nextSongs()
            btnRandom.classList.toggle("active", this.isRandom)
            btnRepeat.classList.toggle("active", this.isRepeat)

        }
}
app.start()