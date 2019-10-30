
const filterUI = new (class {

    constructor(){
        this.$fBox = jQuery("#sc-filter");
        this.$fOpen = jQuery("#sc-filter .open");
        this.$fClose = jQuery("#sc-filter .close");
        this.$fOpenButton = jQuery("#sc-filter .open button.toggle");
        this.$fCloseButton = jQuery("#sc-filter .close button.toggle");
        this.$fSearchButton = jQuery("#fr_gosearch");

        this.$input = {
            query: jQuery("#fr_query"),
            tags: jQuery("#fr_tags"),
            datefrom: jQuery("#fr_datefrom"),
            dateto: jQuery("#fr_dateto"),
            fw_min: jQuery("#fr_fw_min"),
            fw_max: jQuery("#fr_fw_max"),
            fr_drt_min: jQuery("#fr_drt_min"),
            fr_drt_max: jQuery("#fr_drt_max")
        };

        this.$fCloseButton.click((e)=>{
            this.$fClose.hide();
            this.$fOpen.show(200);
        });

        this.$fOpenButton.click((e)=>{
            this.$fClose.show();
            this.$fOpen.hide(200);
        });

        this.$fSearchButton.click((e)=>{
            const filterData = this.getFilterData();
            scTracksMgr.reset();
            scTracksMgr.searchTracks(filterData).then((tracks)=>{
                console.log(tracks);
                playlistUI.reset(tracks);
            });
        });
    }


    getFilterData(){
        const dt = {};
        dt.q=this.$input.query.val();
        dt.tags=this.$input.tags.val();
        dt.datefrom=this.$input.datefrom.val();
        dt.dateto=this.$input.dateto.val();
        dt.extra = {};
        dt.extra.fw_min=this.$input.fw_min.val();
        dt.extra.fw_max=this.$input.fw_max.val();
        dt.fr_drt_min=this.$input.fr_drt_min.val();
        dt.fr_drt_max=this.$input.fr_drt_max.val();

        if(dt.q.length==0) delete dt.q;
        if(dt.tags.length==0) delete dt.tags;

        if(dt.datefrom.length==0) delete dt.datefrom;
        if(dt.dateto.length==0) delete dt.dateto;
        if(dt.datefrom || dt.dateto){
            dt.created_at = {};
            if(dt.datefrom) dt.created_at.from=dt.datefrom+" 00:00:00";
            if(dt.dateto) dt.created_at.to=dt.dateto+" 00:00:00";
            delete dt.datefrom;
            delete dt.dateto;
        }

        if(dt.fr_drt_min.length>0) dt.fr_drt_min=parseInt(dt.fr_drt_min)*60*1000;
        else delete dt.fr_drt_min;
        if(dt.fr_drt_max.length>0) dt.fr_drt_max=parseInt(dt.fr_drt_max)*60*1000;
        else delete dt.fr_drt_max;
        if(dt.fr_drt_min || dt.fr_drt_max){
            dt.duration = {};
            if(dt.fr_drt_min) dt.duration.from=dt.fr_drt_min;
            if(dt.fr_drt_max) dt.duration.to=dt.fr_drt_max;
            delete dt.fr_drt_min;
            delete dt.fr_drt_max;
        }

        if(dt.extra.fw_min.length==0) delete dt.extra.fw_min;
        else dt.extra.fw_min=parseInt(dt.extra.fw_min);

        if(dt.extra.fw_max.length==0) delete dt.extra.fw_max;
        else dt.extra.fw_max=parseInt(dt.extra.fw_max);

        return dt;
    }

});
