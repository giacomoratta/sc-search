
const scTracksMgr = new (class {

    constructor(){
        this.reset()
    }

    reset(){
        this.offset = -10,
        this.tracksMap = new Map();
        this.tracksArray = [];
        this.usersMap = new Map();
        this.nextHref = null;
    }


    searchTracks(){
        if(this.nextHref===false) return null;
        return this.__searchTracks();
    }


    __searchTracks(){
        this.offset += 10;
        return SC.get('/tracks', {
            limit: 10,
            linked_partitioning: 1,
            offset:this.offset,
            //tags:"t,f,g"
            q: 'mix'
            //, license: 'cc-by-sa'
            //,
        }).then((tracks)=>{
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
