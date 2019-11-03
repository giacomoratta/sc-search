
const scTracksMgr = new (class {

    constructor(){
        this.reset()
    }

    reset(){
        this.filterData = null;
        this.filterLimit = 10;
        this.filterOffset = this.filterLimit*(-1);
        this.tracksMap = new Map();
        this.tracksArray = [];
        this.usersMap = new Map();
        this.nextHref = null;
    }


    async searchTracks(filterData){
        if(this.nextHref===false) return null;
        if(filterData){
            this.reset();
            this.filterData=filterData;
        }
        let newTracks = [];
        let maxAttempts = 3;
        let err = null;

        while(!err && newTracks.length<this.filterLimit && maxAttempts>0){
            maxAttempts--;
            let [err,tracks] = await uu.to(this.__searchTracks());
            if(tracks) newTracks=newTracks.concat(tracks);
        }
        return newTracks;
    }


    async __searchTracks(){
        this.filterOffset += this.filterLimit;
        this.filterData.limit = this.filterLimit;
        this.filterData.linked_partitioning = 1;
        this.filterData.offset = this.filterOffset;

        const filterObj = { ...scTracksMgr.filterData };
        delete filterObj.extra;

        let [err,tracks] = await uu.to(SC.get('/tracks', filterObj));
        if(err || !tracks) return [err,tracks];

        let pUsers = [];
        let tracksArrayTmp = [];

        this.nextHref = tracks.next_href;
        await uu.asyncForEach(tracks.collection, async (t)=>{
            if(this.filterData.extra.download===true && t.downloadable!==true) return;

            let [err,user_info] = await uu.to(SC.get('/users/'+t.user.id));
            if(err || !user_info) return;

            this.usersMap.set(user_info.id.toString(),user_info);

            if(this.filterData.extra.fw_max && user_info.followers_count>this.filterData.extra.fw_max) return;
            if(this.filterData.extra.fw_min && user_info.followers_count<this.filterData.extra.fw_min) return;

            t.user_info = user_info;
            this.tracksArray.push(t);
            this.tracksMap.set(t.id.toString(),t);
            tracksArrayTmp.push(t);
            $d(t);
        });

        return tracksArrayTmp;
    }



    async likeTrack(track_id){
        await SC.connect();
        await SC.put('/me/favorites/'+track_id);
    }


    async repostTrack(track_id){
        await SC.connect();
        await SC.put('/e1/me/track_reposts/'+track_id);
    }


    async followAuthor(track_id){
        await SC.connect();
        await SC.put('/me/followings/'+this.tracksMap.get(track_id).user_info.id);
    }

});
