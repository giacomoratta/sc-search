
const scTracksMgr = new (class {

    constructor(){
        this.reset()
    }

    reset(){
        this.tracksMap = new Map();
        this.tracksArray = [];
        this.usersMap = new Map();
        this.usersArray = [];
        this.nextHref = null;
    }


    searchTracks(){
        return SC.get('/tracks', {
            limit: 5,
            linked_partitioning: 1,
            offset:5,
            //tags:"t,f,g"
            q: 'mix'
            //, license: 'cc-by-sa'
        }).then(function(tracks) {
            let pUsers = [];

            tracks.collection.forEach((t)=>{
                pUsers.push(SC.get('/users/'+t.user.id).then(function(user_info) {
                    t.user_info = user_info;
                    tracksArray.push(t);
                }));
            });

            return Promise.all(pUsers)
        });
    }

});
