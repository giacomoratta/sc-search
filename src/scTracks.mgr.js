
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
        let maxAttempts = 8;
        let err = null;

        while(!err && newTracks.length<this.filterLimit && maxAttempts>0){
            maxAttempts--;
            let [err,tracks] = await uu.to(this.__searchTracks());
            if(err){
                $warn('searchTracks',e);
                return [];
            }
            if(tracks && tracks.length>0){
                newTracks=newTracks.concat(tracks);
            }
            else{
                $warn('searchTracks - no more tracks');
                break;
            }
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

        let [err,tracks] = await uu.to(soundcloudAPI.searchTracks(filterObj));
        if(err || !tracks){
            $d('soundcloudAPI.searchTracks >> ',err,tracks);
            return [err,tracks];
        }

        let pUsers = [];
        let tracksArrayTmp = [];

        this.nextHref = tracks.next_href;
        await uu.asyncForEach(tracks.collection, async (t)=>{
            if(this.filterData.extra.download===true && t.downloadable!==true) return;

            let [err,user_info] = await uu.to(soundcloudAPI.getUser(t.user.id));
            if(err || !user_info) return;

            this.usersMap.set(user_info.id.toString(),user_info);

            if(this.filterData.extra.fw_max && user_info.followers_count>this.filterData.extra.fw_max) return;
            if(this.filterData.extra.fw_min && user_info.followers_count<this.filterData.extra.fw_min) return;

            t.user_info = user_info;
            this.tracksArray.push(t);
            this.tracksMap.set(t.id.toString(),t);
            tracksArrayTmp.push(t);
        });

        return tracksArrayTmp;
    }

});
