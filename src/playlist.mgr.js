
const playlistMgr = new (class {

    constructor(){
        this.currentTrack = {
            element:null,
            id:null
        };

        this.$pBox = jQuery("#sc-playlist");
        this.$pBoxItems = jQuery("#sc-playlist .items");
        this.$pLoadmoreBtn = jQuery("#sc-playlist .pl_loadmore");

        this._markedEv = {
            playNext:false,
            playPrev:false
        };

        this.currentTrack = {
            element:null,
            id:null
        }
    }

    __setPlaylistUI() {
        this.$pBox.css({
            top: (Math.round(mainUI.$tabsBox.outerHeight() + mainUI.$tabsBox.offset().top)+8).toString().concat('px'),
            left: mainUI.$tabsBox.offset().top.toString().concat('px')
        })
    }

    showPlaylistUI() {
        this.__setPlaylistUI()
        this.$pBox.show(200, () => {
            this.scrollToPlaying();
        });
    }

    hidePlaylistUI() {
        if(jQuery(window).width()>900) return
        this.$pBox.hide(200)
    }

    togglePlaylistUI() {
        this.__setPlaylistUI();
        this.$pBox.toggle(200, () => {
            this.scrollToPlaying();
        });
    }

    scrollToPlaying() {
        const $element=this.$pBoxItems.find('.item.playing:first');
        if(!$element || !$element.position() || !$element.position().top) return
        this.$pBox.scrollTop(Math.max(0,($element.position().top-100)));
    }

    reset(tracks){
        this.$pBoxItems.html('');
        if(!tracks){
            $warn('playlistMgr - No track found');
            return;
        }
        this.addTracks(tracks);
        this.$pBox.scrollTop(0);
    }


    play($element){
        if(!$element) $element=this.$pBoxItems.find('.item:first');
        if(!$element || $element.length==0) return;
        this.currentTrack.$element = $element;
        this.currentTrack.id = $element.attr('data-tid');

        this.$pBoxItems.find('.item').removeClass('playing');
        $element.addClass('playing');
    
        playerUI.play(this.currentTrack.id);
        trackInfoUI.setInfo(this.currentTrack.id);
        userInfoUI.setInfo(this.currentTrack.id);
        this.scrollToPlaying();
        this.hidePlaylistUI();
    }

    markEvent(name,marked){
        if((Date.now()-this._markedEv[name])<1500){
            //$d('markEvent - already marked');
            return false;
        }
        marked = (marked===true?Date.now():0);
        //$d('markEvent - set ',marked);
        this._markedEv[name]=marked;
        return true;
    }


    async playNext(){
        if(!this.markEvent('playNext',true)) return;

        const $currP = this.$pBoxItems.find('.item.playing').eq(0);
        const $nextP = $currP.next();
        if($currP.length===0){
            this.play();
            this.markEvent('playNext',false);
            return;
        }
        if($nextP.length===0){
            mainUI.$overlay1.show();
            const tracks = await scTracksMgr.searchTracks();
            const newItems = playlistMgr.addTracks(tracks);
            mainUI.$overlay1.hide();
            if(newItems.length===0){
                this.markEvent('playNext',false);
                return;
            }
            this.play(newItems[0]);
            this.markEvent('playNext',false);
            return;
        }
        this.play($nextP);
        this.markEvent('playNext',false);
        return;
    }


    playPrev(){
        if(!this.markEvent('playPrev',true)) return;

        const $currP = this.$pBoxItems.find('.item.playing').eq(0);
        const $prevP = $currP.prev();
        if($currP.length===0 || $prevP.length===0){
            this.play();
            this.markEvent('playPrev',false);
            return;
        }
        this.play($prevP);
        this.markEvent('playPrev',false);
        return;
    }


    addTracks(tracks){
        let newItem, awk_img, created_at, newItems=[];
        tracks.forEach((t)=>{
            awk_img = t.artwork_url || t.user.avatar_url;
            created_at = new Date(t.created_at);

            newItem = jQuery(`
                <div class="item" data-tid="${t.id}">
                    <div class="awk"><img src="${awk_img}" /></div>
                    <div class="iinfo">
                        <div class="username">${t.user_info.username}</div>
                        <div class="title">${t.title}</div>
                        <div class="small duration">Duration: ${uu.string.msToDuration(t.duration)}</div>
                        <div class="small created_at">Created at: ${created_at.getFullYear()}/${created_at.getMonth()+1}/${created_at.getDate()}</div>
                    </div>
                    <div class="kv_box small tstats">
                        <div class="likes"><span class="value">${t.likes_count}</span> <span class="label">likes</span> //</div>
                        <!--div class="plays"><span class="value">${t.playback_count}</span> <span class="label">plays</span> //</div-->
                        <div class="reposts"><span class="value">${t.reposts_count}</span> <span class="label">reposts</span></div>
                        ${t.downloadable ? `<div class="downloads">// <span class="value">${t.download_count}</span> <span class="label">downloads</span></div>` : '' }
                        ${t.downloadable ? `<div class="downloadable">// <strong>D</strong></div>` : '' }
                    </div>
                    <div class="kv_box small ustats">
                        ${(t.user_info.country || t.user_info.city) ? `<div class="location">${t.user_info.country ? `${t.user_info.country}` : '' }${t.user_info.city ? `, ${t.user_info.city}` : '' } //</div>` : '' }
                        <div class="followers"><span class="value">${t.user_info.followers_count}</span> <span class="label">followers</span> //</div>
                        <div class="tracks"><span class="value">${t.user_info.track_count}</span> <span class="label">tracks</span></div>
                    </div>
                </div>
            `);
            this.$pBoxItems.append(newItem);
            newItems.push(newItem);

            newItem.click((e)=>{
                this.play(jQuery(e.currentTarget));
            });
        });
        return newItems;
    }



});
