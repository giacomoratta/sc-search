
const filterUI = new (class {

    constructor(){
        this.$fBox = jQuery("#sc-filter");
        this.$fOpen = jQuery("#sc-filter .open");
        this.$fClose = jQuery("#sc-filter .close");
        this.$fOpenButton = jQuery("#sc-filter .open button.toggle");
        this.$fCloseButton = jQuery("#sc-filter .close button.toggle");
        this.$fResetButton = jQuery("#sc-filter .open button.resetf");
        this.$fSearchButton = jQuery("#fr_gosearch");

        this.$input = {
            query: jQuery("#fr_query"),
            tags: jQuery("#fr_tags"),
            //genres: jQuery("#fr_genres"),
            download: jQuery("#fr_download"),
            datefrom: jQuery("#fr_datefrom"),
            dateto: jQuery("#fr_dateto"),
            fw_min: jQuery("#fr_fw_min"),
            fw_max: jQuery("#fr_fw_max"),
            fr_drt_min: jQuery("#fr_drt_min"),
            fr_drt_max: jQuery("#fr_drt_max")
        };

        if(this.restoreFilterSettings()!==true) {
            this.setDefaultValues();
        }

        this.$fCloseButton.click((e)=>{
            this.$fClose.hide();
            this.$fOpen.show(200);
        });

        this.$fOpenButton.click((e)=>{
            this.$fClose.show();
            this.$fOpen.hide(200);
        });

        this.$fResetButton.click((e)=>{
            this.setDefaultValues();
        });

        this.$fSearchButton.click(async (e)=>{
            this.saveFilterSettings();
            mainUI.$overlay1.show();
            const filterData = this.getFilterData();
            const tracks = await scTracksMgr.searchTracks(filterData);
            if(!tracks || tracks.length==0){
                alert("filterUI - No tracks found");
                $warn("filterUI - No tracks found");
            }
            playlistMgr.reset(tracks);
            this.$fClose.show();
            this.$fOpen.hide(200);
            mainUI.$overlay1.hide();
        });
    }


    setDefaultValues(){
        let date_today = new Date();
        let date_from = new Date();
        date_today.setDate(date_today.getDate()+1);
        date_from.setDate(date_today.getDate()-3);
        this.$input.datefrom.val(date_from.getFullYear()+'-'+(date_from.getMonth()+1).toString().padStart(2,'0')+'-'+date_from.getDate().toString().padStart(2,'0'));
        this.$input.dateto.val(date_today.getFullYear()+'-'+(date_today.getMonth()+1).toString().padStart(2,'0')+'-'+date_today.getDate().toString().padStart(2,'0'));

        this.$input.query.val("");
        this.$input.tags.val('techno');
        //this.$input.genres.val('techno');

        this.$input.fw_min.val(10);
        this.$input.fw_max.val(2600);

        this.$input.fr_drt_min.val(1);
        this.$input.fr_drt_max.val(16);
        this.$input.download.prop('checked',false);
    }


    restoreFilterSettings(){
        const filtersettings = localStorage.getItem('scFilterSettings');
        if(!filtersettings) return false;
        let dt;
        try{
            dt = JSON.parse(filtersettings)
        }catch(e){
            $d('restoreFilterSettings',e);
            return false;
        }
        this.$input.query.val(dt.q);
        //this.$input.genres.val(dt.genres);
        this.$input.tags.val(dt.tags);
        this.$input.datefrom.val(dt.datefrom);
        this.$input.dateto.val(dt.dateto);
        this.$input.fw_min.val(dt.extra.fw_min);
        this.$input.fw_max.val(dt.extra.fw_max);
        this.$input.fr_drt_min.val(dt.fr_drt_min);
        this.$input.fr_drt_max.val(dt.fr_drt_max);
        this.$input.download.prop('checked',dt.extra.download);
        return true;
    }


    saveFilterSettings(){
        const dt = {};
        dt.q=this.$input.query.val();
        //dt.genres=this.$input.genres.val();
        dt.tags=this.$input.tags.val();
        dt.datefrom=this.$input.datefrom.val();
        dt.dateto=this.$input.dateto.val();
        dt.extra = {};
        dt.extra.fw_min=this.$input.fw_min.val();
        dt.extra.fw_max=this.$input.fw_max.val();
        dt.fr_drt_min=this.$input.fr_drt_min.val();
        dt.fr_drt_max=this.$input.fr_drt_max.val();
        dt.extra.download=this.$input.download.prop('checked');
        localStorage.setItem('scFilterSettings', JSON.stringify(dt));
    }


    getFilterData(){
        const dt = {};
        dt.q=this.$input.query.val();
        //dt.genres=this.$input.genres.val();
        dt.tags=this.$input.tags.val();
        dt.datefrom=this.$input.datefrom.val();
        dt.dateto=this.$input.dateto.val();
        dt.extra = {};
        dt.extra.fw_min=this.$input.fw_min.val();
        dt.extra.fw_max=this.$input.fw_max.val();
        dt.fr_drt_min=this.$input.fr_drt_min.val();
        dt.fr_drt_max=this.$input.fr_drt_max.val();

        dt.extra.download=this.$input.download.prop('checked');

        if(dt.q.length==0) delete dt.q;
        //if(dt.genres.length==0) delete dt.genres;
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
