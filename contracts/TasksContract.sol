// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

// Se crea el contrato
contract TasksContract {
    // Lo vuelvo publica para poder llamarlo desde el entorno
    uint public taskCounter = 0;

    constructor(){
        createTask("tarea por defecto", "sin comentarios","0.003");
    }

    event TaskCreated(
        uint id,
        string title,
        string description,
        string amount,
        bool done,
        uint createdAt
    );

    event TaskToggleDone (uint id, bool done);

    // Parametrizar el tipo de dato de la tarea
    struct Task{
        uint id;
        string title;
        string description;
        string amount;
        bool done;
        uint256 createdAt; //porque no fecha porque Solidity usa timestap
    }

    /* Mapping es un conjunto de datos que contiene un par clave valor y la key podria ser cualquier tipo de valor
    para retornar debe recorrer todos los elementos
    uint256 es un tipo de valor entero sin negativos */
    mapping (uint256 => Task) public tasks; // la lista se llama task

    /* Las variables a interactuar y memory significa que no se escriben aun en la blockhain si no que se guardan en memoria 
    luego hay que decirle como queremos ver esa funcion es decir que no solo es funcionamiento interno si no que tambien 
    la podre llamar fuera de la blockchain. */
    
    // Estos serian los metodos
    function createTask(string memory _title, string memory _description, string memory _amount) public {
        // Introducimos la tarea en la funcion
        taskCounter++;
        tasks[taskCounter] = Task(taskCounter, _title, _description, _amount, false, block.timestamp);
        emit TaskCreated(taskCounter, _title, _description, _amount, false, block.timestamp);
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done; // Lo cambio a su valor contrario
        tasks[_id ] = _task;
        emit TaskToggleDone(_id, _task.done);
    }
}