const scSearchUtils = new (class {

    constructor(){
    }

    to(promise) {
       return promise.then(data => {
          return [null, data];
       })
       .catch(err => [err]);
    }

    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

});
const uu = scSearchUtils;
