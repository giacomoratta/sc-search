
const filterUI = new (class {

    constructor(){
        this.$filterBox = jQuery("#sc-filter");
        this.$filterOpen = jQuery("#sc-filter .open");
        this.$filterClose = jQuery("#sc-filter .close");
        this.$filterOpenButton = jQuery("#sc-filter .open button.toggle");
        this.$filterCloseButton = jQuery("#sc-filter .close button.toggle");

        this.$filterCloseButton.click((e)=>{
            this.$filterClose.hide();
            this.$filterOpen.show(200);
        });

        this.$filterOpenButton.click((e)=>{
            this.$filterClose.show();
            this.$filterOpen.hide(200);
        });
    }


    getFilterData(){
        
    }

});
