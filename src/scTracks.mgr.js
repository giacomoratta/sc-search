
const scTracksMgr = new (class {

    constructor(){
        this.reset()
    }

    reset(){
        this.filterData = null;
        this.offset = -10,
        this.tracksMap = new Map();
        this.tracksArray = [];
        this.usersMap = new Map();
        this.nextHref = null;
    }


    searchTracks(filterData){
        if(this.nextHref===false) return null;
        if(filterData) this.filterData=filterData;
        return this.__searchTracks();
    }


    __searchTracks(){
        this.offset += 10;
        this.filterData.limit = 10;
        this.filterData.linked_partitioning = 1;
        this.filterData.offset = this.offset;

        return SC.get('/tracks', this.filterData)
        .then((tracks)=>{
            let pUsers = [];
            let tracksArrayTmp = [];

            this.nextHref = tracks.next_href;
            tracks.collection.forEach((t)=>{
                if(this.filterData.extra.download===true && t.downloadable!==true) return;

                pUsers.push(SC.get('/users/'+t.user.id).then((user_info)=>{
                    this.usersMap.set(user_info.id,user_info);

                    if(this.filterData.extra.fw_max && user_info.followers_count>this.filterData.extra.fw_max) return;
                    if(this.filterData.extra.fw_min && user_info.followers_count<this.filterData.extra.fw_min) return;

                    t.user_info = user_info;
                    this.tracksArray.push(t);
                    this.tracksMap.set(t.id,t);
                    tracksArrayTmp.push(t);
                }));
            });

            return Promise.all(pUsers).then((x)=>{
                return tracksArrayTmp;
            })
        });
    }

});
