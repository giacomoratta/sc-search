
const trackInfoUI = new (class {

    constructor(){
        this.$tiBox = jQuery("#sc-trackinfo");
    }

    setInfo(track_id){
        this.$tiBox.hide();
        const t = scTracksMgr.tracksMap.get(track_id);
        this.$tiBox.html('');
        this.$tiBox.attr('data-tid','');
        if(!t){
            console.warn('trackInfoUI - No track found');
            return;
        }

        this.$tiBox.show();
        this.$tiBox.attr('data-tid',t.id);
        this.$tiBox.html(`
            <div class="smbox overview">
                <div class="title"><a href="${t.permalink_url}" target="blank">${t.title}</a></div>
            </div>
            <div class="smbox kv_box meta">
                <div class="likes"><span class="value">${t.likes_count}</span> <span class="label">likes</span> //</div>
                <div class="reposts"><span class="value">${t.reposts_count}</span> <span class="label">reposts</span> //</div>
                ${t.downloadable ? `<div class="downloads"><a href="${t.download_url ? t.download_url : '#'}" target="blank"><span class="value">${t.download_count}</span> <span class="label">downloads</span></a> //</div>` : '' }
                <div class="buy"><a href="${t.purchase_url ? t.purchase_url : '#' }" target="blank">buy</a></div>
            </div>
            <div class="smbox trackdesc">${t.description}</div>
            <div class="smbox tracktags"><strong>${t.genre}</strong>, ${t.tag_list}</div>
        `);
    }

});
