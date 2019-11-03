
const userInfoUI = new (class {

    constructor(){
        this.$uiBox = jQuery("#sc-userinfo");

        this.$uiBox.find('.follow').click((e)=>{
            scTracksMgr.followAuthor(playlistMgr.currentTrack.id);
        });
    }

    setInfo(track_id){
        const t = scTracksMgr.tracksMap.get(track_id);
        this.$uiBox.html('');
        this.$uiBox.attr('data-uid','');
        if(!t){
            console.error('no track found');
            return;
        }
        if(!t.user_info){
            console.error('no user found');
            return;
        }
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
    }

});
