/**
 * Created by Winston Y on 8/20/2020.
 */

import { LightningElement, api } from 'lwc';
import updateToDo from "@salesforce/apex/ToDoController.updateToDo";
import deleteToDo from "@salesforce/apex/ToDoController.deleteToDo";

export default class ToDoItem extends LightningElement {
    /*
        Public properties are reactive. If the value of a public property changes, the component re-renders.
        To expose a public property, decorate a field with @api
    */
    @api toDoId;
    @api toDoName;
    @api done = false;

    updateHandler(){
        const toDo = {
            toDoId : this.toDoId,
            toDoName : this.toDoName,
            done : !this.done
        };

        updateToDo({
            'payload' : JSON.stringify(toDo)
        }).then(result => {
            console.log('Item is updated successfully');
            /*
                Once successful, we want to notify parent component that list is updated and needs to re-render
                Events can be to communicate from the child component to the parent component. You can also pass the payload/data along with the event
                const updateEvent = new CustomEvent('EVENT NAME', {detail:{payload}})
            */
            const updateEvent = new CustomEvent('update');
            this.dispatchEvent(updateEvent);
        }).catch(error => {
            console.log(JSON.stringify(toDo));
            console.error('Error in updating to do item ' + JSON.stringify(error));
        });
    }

    deleteHandler(){
        deleteToDo({
            'toDoId' : this.toDoId
        }).then(result => {
          console.log('Item is deleted successfully');
          const deleteEvent = new CustomEvent('delete');
                      this.dispatchEvent(deleteEvent);
      }).catch(error => {
          console.log(JSON.stringify(toDo));
          console.error('Error in deleting to do item ' + JSON.stringify(error));
      });
    }

    // get property to return container class
    get containerClass() {
        return this.done ? "todo completed" : "todo upcoming";
    }

    // Dynamically set the icon based on done
    get iconName(){
        return this.done ? "utility:check" : "utility:add";
    }
}