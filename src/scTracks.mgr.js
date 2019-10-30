
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

        console.log(this.filterData);

        return SC.get('/tracks', this.filterData)
        .then((tracks)=>{
            let pUsers = [];

            this.nextHref = tracks.next_href;
            tracks.collection.forEach((t)=>{
                pUsers.push(SC.get('/users/'+t.user.id).then((user_info)=>{
                    this.usersMap.set(user_info.id,user_info);
                    this.tracksArray.push(t);
                    this.tracksMap.set(t.id,t);
                }));
            });

            return Promise.all(pUsers).then((x)=>{
                return tracks.collection;
            })
        });
    }

});
