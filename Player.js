class Player{
    constructor(){
        this.name="";
        this.LP=8000;     
        this.password=""   
    }
    RegistName(name) {
        this.name=name;
    }
    CalculateLP(num,operator){
        switch(operator){
            case 0:
            case "+":
            this.decrementLP(-num);
            break;
            case 1:
            case "-":
            this.decrementLP(num);
            break;
            case 2:
            case "/2":
            this.decrementLP(this.LP/2);
        }
    }
    decrementLP(num){
        this.LP=Math.round(this.LP-num);
        
    }
    resetLP(){
        this.LP=8000;
    }
}