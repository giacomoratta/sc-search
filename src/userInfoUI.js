
const userInfoUI = new (class {

    constructor(){
        this.$uiBox = jQuery("#sc-userinfo");
    }

    setInfo(track_id){
        this.$uiBox.hide();
        const t = scTracksMgr.tracksMap.get(track_id);
        this.$uiBox.html('');
        this.$uiBox.attr('data-uid','');
        if(!t){
            console.warn('userInfoUI - No track found');
            return;
        }
        if(!t.user_info){
            console.warn('userInfoUI - No track info found');
            return;
        }

        this.$uiBox.show();
        const u = t.user_info;

        this.$uiBox.attr('data-uid',u.id);
        this.$uiBox.html(`
            <div class="overview">
                <div class="avatar"><img src="${u.avatar_url}" style="width:80px; height:80px; background-color:#333;" /></div>
                <div class="name"><a href="${u.permalink_url}" target="blank">${u.username}</a></div>
                <div class="personal">${u.full_name}${(u.country || u.city) ? `(${u.country ? `${u.country}` : '' }${u.city ? `, ${u.city})` : '' }` : '' }
                </div>
                <div class="kv_box meta">
                    <div class="followers"><span class="value">${u.followers_count}</span> <span class="label">followers</span> //</div>
                    <div class="following"><span class="value">${u.followings_count}</span> <span class="label">following</span> //</div>
                    <div class="tracks"><span class="value">${u.track_count}</span> <span class="label">tracks</span></div>
                </div>
            </div>
            <div class="smbox userdesc">${u.description}</div>
            <div class="buttons">
                <button class="follow">Follow/Followback</button>
            </div>
        `);

        this.$uiBox.find('.follow').click((e)=>{
            this.followCurrentAuthor()
        });
    }



    async followCurrentAuthor(){
        const ct = scTracksMgr.tracksMap.get(playlistMgr.currentTrack.id);
        console.log(ct,ct.user_info,ct.user_info.id);
        if(!ct || !ct.user_info) return;
        let [err,tracks] = await uu.to(soundcloudAPI.followUser(u.id));
        console.log(err,tracks);
    }

});
