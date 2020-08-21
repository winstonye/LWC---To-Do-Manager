/**
 * Created by Winston Y on 8/20/2020.
 */

public class ToDoController {
    // Add a new item in To_Do__c object
    // Accepts serialized ToDo object
    // payload = plain javascript object
    @AuraEnabled
    public static String addTodo(String payload) {
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);

//        SObject todo = (Sobject) Type.forName('To_Do__c').newInstance();
//        todo.put('Name', payloadObject.toDoName);
//        todo.put('Done__c', payloadObject.done);
//        insert todo;
//
//        return String.valueOf(todo.Id);

        To_Do__c toDo = new To_Do__c(
                Name = payloadObject.toDoName,
                Done__c = payloadObject.done
        );

        insert toDo;

        return String.valueOf(toDo.Id);
    }

    //Update an item
    //Accepts serialized ToDo object
    @AuraEnabled
    public static void updateToDo(String payload) {
        system.debug(payload);
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);

        SObject todo = (Sobject) Type.forName('To_Do__c').newInstance();
        todo.put('Id', payloadObject.toDoId);
        todo.put('Name', payloadObject.toDoName);
        todo.put('Done__c', payloadObject.done);
        system.debug(todo);

        update todo;
    }

    //Delete an item
    //Accepts id of the item to delete
    @AuraEnabled
    public static void deleteToDo(String toDoId) {
        SObject todo = (Sobject) Type.forName('To_Do__c').newInstance();
        todo.put('Id', toDoId);

        delete todo;
    }

    //Get all todos for today
    @AuraEnabled
    public static List<ToDo> getCurrentTodos() {
        List<SObject> todos = Database.query(
                'SELECT Id, Name, CreatedDate, Done__c FROM To_Do__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC'
        );
        return getToDos(todos);
    }

    //Wrap To_Do__c SObject into ToDo object
    public static List<ToDo> getToDos(List<SObject> objs) {
        List<ToDo> todos = new List<ToDo>();
        for (SObject obj : objs) {
            ToDo todo = new ToDo();
            todo.toDoId = obj.Id;
            todo.toDoName = String.valueOf(obj.get('Name'));
            todo.toDoDate = Date.valueOf(obj.get('CreatedDate'));
            todo.done = Boolean.valueOf(obj.get('Done__c'));
            todos.add(todo);
        }

        return todos;
    }

    //Wrapper Class to represent a ToDo Item
    public class ToDo {
//        @AuraEnabled
//        public String toDoId; - No need Salesforce creates this
        @AuraEnabled
        public String toDoName;
//        @AuraEnabled
//        public Date toDoDate; - No need Salesforce creates this
        @AuraEnabled
        public Boolean done;
    }
}