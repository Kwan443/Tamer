
export class ItemBox {
    constructor() {
        this.items = new Array(36).fill(null); 
        this.items_amount = new Array(36).fill(0); 
    }
    
    setValue(item) {
        let index=0;
        let have_same=0;
        if(this.items[index] != null&&this.items[index].number == item.number){
            have_same=1;
        }
        while(this.items[index] != null&&this.items[index].number != item.number){
            have_same=0;
            index++;
            if(index == this.items.length){
                break;
            }
            have_same=1;
        }
        if(have_same==0){
            index=0;
            while(this.items[index] != null){
                index++;
                if(index == this.items.length){
                    console.error("Index out of bounds.");
                    return -1;
                }
            }
        }
        if (this.items[index] ==null) {
            this.items[index] = item;
            this.items_amount[index] = 1;
            console.log(index);
            return index;
        } else if(this.items[index].number == item.number){
            this.items_amount[index]++;
            console.log(index);
            return -1;
        }
        else{
            console.error("Index out of bounds OR Not same item.");
            return -1;
        }
    }
    checkNull(index){
        return this.items[index] == null;
    }
}