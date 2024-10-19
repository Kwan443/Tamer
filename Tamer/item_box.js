export class ItemBox {
    constructor() {
        this.items = new Array(36).fill(null); 
        this.items_amount = new Array(36).fill(0); 
    }

    setValue(index, item) {
        if (index >= 0 && index < this.items.length&&this.items[index] ==null) {
            this.items[index] = item;
            this.items_amount[index] = 1;
        } else if(index >= 0 && index < this.items.length&&this.items[index] &&this.items[index].number == item.number){
            this.items_amount[index]++;
            return false;
        }else if(this.items[index] && this.items[index].number != item.number){
            console.error("Not same item.");
            return false;
        }
        else {
            console.error("Index out of bounds.");
            return false;
        }
        return true;
    }

}