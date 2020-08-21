/**
 * Created by Winston Y on 8/20/2020.
 * Note - Communicate from [PARENT TO CHILD] use public properties
 *        Communicate from [CHILD TO PARENT] use custom events
 */

import { LightningElement, track } from 'lwc';
import addToDo from "@salesforce/apex/ToDoController.addTodo";
import getCurrentTodos from "@salesforce/apex/ToDoController.getCurrentTodos";

export default class ToDoManager extends LightningElement {
    /*
            Declare properties
            After Spring'20 all private properties are reactive and we do not need to add @track in front of properties to make them reactive.
            However, it is recommended to use @track for objects to listen for changes

            HTML file can reference the below via {NAME}
    */
    time = "8:88 PM";
    greeting = "Good Evening";

    @track toDos = [];

    // Life cycle method. This gets called as soon as the component is initialized
        connectedCallback() {
            //get current time
            this.getTime();
            this.populateToDos();
            this.fetchToDos();

            /*
                The setInterval(callback, millis, params) method repeatedly calls a function or executes a code snippet, with a fixed time delay between each call
            */
            setInterval( () => {
                this.getTime();
            }, 1000*60);
        }

    /*
            Get time
    */
    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        /*
            Back quotes (`) are called temperate literals.
            They are string literals that allows embedded expressions.
            You can use multi-line strings and string interpolation features with them.
            Ex:
                `string text line 1
                 string text line 2`

                `string text ${expression} string text`

            Dollar sign ($) are a identifier. It is a shortcut to the function document.getElementById().

            Below code grabs the hour based on the 12hr format, it then grabs minutes based on the double digit format and lastly it will display "AM/PM" based on the time
        */
        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMidDay(hour)}`;

        // Once time is set, we can call our setGreeting method to display the greeting
        this.setGreeting(hour);
    }

    /*
            Get hour form the 12hr format
    */
    getHour(hour){
        // Ternary operator (condition ? <true> : <false>)
        /*
            Checks if hour is equals to 0, if so then return 12.
            Then it will check if hour is greater than 12, meaning it is after 12pm.
            If so, we need to subtract current value from 12. For example, if it is 1pm, the hour value will be 13.
            Otherwise, just display hour.
        */
        return hour === 0
            ? 12
            : hour > 12
            ? (hour - 12)
            : hour;
    }

    /*
        Based on the hour it will display "AM" or "PM"
    */
    getMidDay(hour){
        return hour >= 12
            ? "PM"
            : "AM";
    }

    /*
        Make sure the hour is in double digit, so 01, for 1 AM 08 for 8 AM
    */
    getDoubleDigit(digit){
        return digit < 10
            ? "0" + digit
            : digit;
    }

    /*
            Get greeting
            Display greeting based on the passed in hour from getTime()
    */
    setGreeting(hour){
        if (hour < 12){
          this.greeting = "Good Morning";
        }
        else if (hour >= 12 && hour < 17){
          this.greeting = "Good Afternoon";
        }
        else{
          this.greeting = "Good Evening";
        }
    }

     /*
            When user click on the '+' it will capture the value from the input and add it to the handler
    */
    addToDoHandler(){
        // We cannot directly do DOCUMENT.queryselector, we need to use the local services
        const inputBox = this.template.querySelector("lightning-input");
        console.log('current value: ', inputBox.value);

        const toDo = {
            // Salesforce will automatically generate this
//            toDoId: this.toDos.length,
            toDoName: inputBox.value,
            done: false
            // Salesforce will automatically generate this
//            toDoDate: new Date()
        };

    /*
        Passing in variable payload to method. JSON.stringify converts JS object to a JSON String
        The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value
    */
        addToDo({
            'payload' : JSON.stringify(toDo)
        }).then(response => {
            console.log('Item is inserted successfully');
            // Retrieve latest list from server
            this.fetchToDos();
        }).catch(error => {
            console.log(JSON.stringify(toDo));
            console.error('Error in inserting to do item ' + JSON.stringify(error));
        });
//        this.toDos.push(toDo);
        inputBox.value = "";
    }

    /*
        Filter through the to do list and only grab items that have done: false
    */
    get upcomingTasks(){
        // The filter() method creates a new array with all elements that pass the test implemented by the provided function
        return this.toDos && this.toDos.length
            ? this.toDos.filter( toDo => !toDo.done )
            : [];
    }

    fetchToDos(){
        getCurrentTodos().then(result => {
            if(result)
            {
                console.log('Item is retrieved successfully');
                // This update the to do in our property
                this.toDos = result;
            }
        }).catch(error =>{
            console.log('Error in retrieving items.' + JSON.stringify(error));
        });
    }

    updateHandler(){
        this.fetchToDos();
    }

    deleteHandler(){
        this.fetchToDos();
    }

     /*
        Filter through the to do list and only grab items that have done: true
    */
    get completedTasks(){
        // The filter() method creates a new array with all elements that pass the test implemented by the provided function
        return this.toDos && this.toDos.length
            ? this.toDos.filter( toDo => toDo.done )
            : [];
    }

     // Test
     populateToDos(){
        const toDos= [
            {
                toDoId: 0,
                toDoName: "Feed the dog",
                done: false,
                toDoDate: new Date()
            },
            {
                toDoId: 1,
                toDoName: "Wash the car",
                done: false,
                toDoDate: new Date()
            },
            {
                toDoId: 2,
                toDoName: "Send email to manager",
                done: true,
                toDoDate: new Date()
            }
        ];
        this.toDos = toDos;
    }
}