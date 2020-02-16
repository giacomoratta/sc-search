
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
            $warn('trackInfoUI - No track found');
            return;
        }

        let formatted_taglist = [];
        if(t.tag_list) formatted_taglist=t.tag_list.split(/("[^"]+"|[^\s]+)/giu).filter((e)=>{ return !(!e || e==" "); });
        if(t.genre) formatted_taglist.unshift(`<strong>${t.genre}</strong>`);

        let formatted_purchaseurl = '';
        let created_at = new Date(t.created_at);
        if(t.purchase_url) formatted_purchaseurl=t.purchase_url.match(/^https?\:\/\/([w]{3}\.{1})?([^\/:?#]+)(?:[\/:?#]|$)/i)[2];

        this.$tiBox.show();
        this.$tiBox.attr('data-tid',t.id);
        this.$tiBox.html(`
            <div class="smbox overview">
                <div class="title"><a href="${t.permalink_url}" target="blank">${t.title}</a></div>
            </div>
            <div class="smbox kv_box meta">
                <div class="likes"><span class="value">${t.likes_count}</span> <span class="label">likes</span> //</div>
                <div class="reposts"><span class="value">${t.reposts_count}</span> <span class="label">reposts</span></div>
                ${t.downloadable ? `<div class="downloads">// <a href="${t.download_url ? t.download_url : '#'}" target="blank"><span class="value">${t.download_count}</span> <span class="label">downloads</span></a></div>` : '' }
                ${t.purchase_url ? `<div class="buy">// <a href="${t.purchase_url}" target="blank">${formatted_purchaseurl}</a></div>` : '' }
            </div>
            ${(t.description) ? `<div class="smbox trackdesc">${t.description}</div>`:''}
            <div class="smbox small duration">Duration: <strong>${uu.string.msToDuration(t.duration)}</strong></div>
            <div class="smbox small created_at">Created at: <strong>${created_at.getFullYear()}/${created_at.getMonth()+1}/${created_at.getDate()}</strong></div>
            <div class="smbox tracktags">${formatted_taglist.join(', ')}</div>
        `);
    }

});
