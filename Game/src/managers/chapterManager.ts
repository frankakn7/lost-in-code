import ApiHelper from "../helpers/apiHelper";

export type ChapterType = {
    id:number,
    name:string,
    material: string,
    curriculum_id: number,
    order_position: number
}

export default class ChapterManager {
    private chapters = [];
    private currentChapterOrderPosition = 1;

    private apiHelper = new ApiHelper();

    private fetchChapters(){
        return new Promise((resolve, reject) => {
            // resolve([
            //     {
            //         "id": 21,
            //         "name": "Introduction",
            //         "material": "What is PHP? \nPHP is a server-side open-source scripting language used for creating dynamic web pages. The abbreviation stands for Hypertext Preprocessor. PHP allows developers to create dynamic content and interact with databases. It is a widely used and popular language for web development. \nPHP runs on the server, which means the server processes the PHP code and sends the resulting HTML code to the client (usually a web browser). This allows developers to create web pages that respond to user input, retrieve and process data from databases, and generate content dynamically. \nPHP is easy to learn and developing executable applications is possible even as a beginner. Due to it’s widespread use, a lot of Programming-Tools support PHP. \nHowever, there are also disadvantages in using PHP. The syntax can be inconsistent, because of changes made in the evolution of PHP. PHP is a weakly typed language, meaning variable types do not need to be explicitly declared. While this can make coding quicker and easier, it can also lead to unexpected behavior and bugs if not handled carefully.",
            //         "curriculum_id": 19,
            //         "order_position": 1
            //     },
            //     {
            //         "id": 22,
            //         "name": "Syntax",
            //         "material": "A PHP script can be embedded anywhere in an HTML document. It always starts with (<?php) and ends with (?>). \nWith the function (echo) you can display the following text in the browser. \nComments can be written with (//) or with multiline (/* */). Comments are sections of text in a program that are ignored for execution and are used only to document or explain the code. Comments allow developers to leave notes, explanations, or hints in the source code to help other developers or themselves better understand the code. \nInstructions must always be terminated with a (;).",
            //         "curriculum_id": 19,
            //         "order_position": 2
            //     },
            //     {
            //         "id": 23,
            //         "name": "Variables",
            //         "material": "Variables are placeholders that are addressed by their names. They are used because they can be easily changed without having to modify the entire program. The concept of variables is already known from mathematics. Variables can be imagined as containers that store data. In code, variables are replaced by their values.\nIn PHP, variables can have the following characteristics:\nDeclaration: A variable is declared by assigning a name to it. The name must start with a dollar sign ($), followed by a valid identifier. The name of a variable must always start with a letter or underscore (_). Case sensitivity is observed. For example: $number, $name, $age.\nAssignment: To assign a value to a variable, the assignment operator (=) is used. \nDynamic Typing: In PHP, variables do not need to be declared with a specific data type beforehand. PHP is a dynamically typed language, which means that the data type of a variable is automatically determined based on the assigned value. As a result, a variable can change its data type during runtime. (Data types will be explained in the next chapter)\nUsage: A variable can be used at various points in the code to access its value, modify it, or use it in calculations. For example, the value of a variable can be displayed in an output or passed as a parameter to a function.",
            //         "curriculum_id": 19,
            //         "order_position": 3
            //     },
            //     {
            //         "id": 24,
            //         "name": "Data Types",
            //         "material": "Data types describe the kind of data is being used and restrict what can be done with that data. PHP supports several data types, including:\nString: a sequence of characters or text, enclosed in (\"\") or ('') for example \"Hello World\"\nInteger: a non-decimal number between -2,147,483,648 and 2,147,483,647\nFloat: a number with a decimal point or a number in exponential form\nBoolean: a truth value, has two possible states: True or False\nArray: a list that stores multiple values in one single variable for example $cars = array(\"Volvo\",\"BMW\",\"Toyota\");\nNULL: has only one value: NULL, represents an empty variable",
            //         "curriculum_id": 19,
            //         "order_position": 4
            //     },
            //     {
            //         "id": 25,
            //         "name": "Strings",
            //         "material": "Strings in PHP are used to represent and manipulate text data. There are multiple rules and functions to manipulate and work with Strings\nConcatenation: Strings can be concatenated using the dot (.) operator. Example: $greeting = \"Hello\" . \"World!\";\nVariable interpolation: In double-quoted strings, variables can be directly embedded by enclosing them in curly braces. Example: $name = \"John\"; echo \"My name is {$name}.\";\nEscaping characters: Certain characters have special meanings in strings, and if you want to include them as literal characters, you need to escape them using a backslash. Example: $message = \"He said, \"Hello!\"\";\nAccessing characters: Individual characters within a string can be accessed using square brackets and the zero-based index. Example: $name = \"John\"; echo $name[0]; // Output: \"J\"\nLength: strlen() function returns the length of a string\nCount: str_word_count() function counts the number of words in a string\nReverse: strrev() function reverses a string\nString manipulation functions: PHP provides numerous built-in functions for manipulating strings, such as strtolower(), strtoupper(), substr(), strpos(), str_replace(), and many more. These functions help with tasks like converting case, extracting substrings, finding and replacing text, and more.",
            //         "curriculum_id": 19,
            //         "order_position": 5
            //     },
            //     {
            //         "id": 26,
            //         "name": "Operators",
            //         "material": "Operators in PHP are symbols or characters that are used to perform various operations on variables and values. PHP provides a wide range of operators for different purposes. Here's an overview of the important operators in PHP:\n1. Arithmetic Operators:\n- Addition: (+)\n- Subtraction: (-)\n- Multiplication: (*)\n- Division: (/)\n- Modulo (Remainder): (%)\n- Exponentiation: (**)\n2. Assignment Operators:\n- Assign: (=)\n- Addition assignment: (+=)\n- Subtraction assignment: (-=)\n- Multiplication assignment: (*=)\n- Division assignment: (/=)\n- Modulo assignment: (%=)\n- Concatenation assignment: (.=) (for strings)\n3. Comparison Operators:\n- Equal to: (==)\n- Identical to: (===)\n- Not equal to: (!=) or (<>)\n- Not identical to: (!==)\n- Greater than: (>)\n- Less than: (<)\n- Greater than or equal to: (>=)\n- Less than or equal to: (<=)\n4. Logical Operators:\n- AND: (&&) or (and)\n- OR: (||) or (or)\n- NOT: (!) or (not)\n5. Increment and Decrement Operators:\n- Increment: (++)\n- Decrement: (--)",
            //         "curriculum_id": 19,
            //         "order_position": 6
            //     },
            //     {
            //         "id": 27,
            //         "name": "If-Statements",
            //         "material": "If-statements are a fundamental part of programming languages, including PHP. They allow you to make decisions in your code based on certain conditions. The basic syntax of an if-statement in PHP is as follows:\n beispiel!!! \n Here's how it works:\n1. The condition is an expression that evaluates to either true or false. It can involve comparisons, logical operators, or other conditions. For example, $age > 18 or $name == \"John\".\n2. If the condition evaluates to true, the code block enclosed in curly braces ({}) is executed. This code block can contain one or more statements that will be executed if the condition is met.\n3. If the condition is false, the code block is skipped, and the program moves on to the next statement after the if-statement.\nYou can also extend the if-statement with additional clauses:\nelse: You can use the else clause to specify an alternative code block that will be executed if the initial condition is false. The syntax is as follows: \n beispiel!!!\n elseif: If you have multiple conditions to check, you can use the elseif clause to specify additional conditions. The syntax is as follows:\n beispiel!!!\nBy using if-statements, you can control the flow of your program and make it perform different actions based on different conditions. This is crucial for building dynamic and interactive applications.",
            //         "curriculum_id": 19,
            //         "order_position": 7
            //     },
            //     {
            //         "id": 28,
            //         "name": "While Loops",
            //         "material": "While loops are iterative control structures in PHP that allow you to repeatedly execute a block of code as long as a certain condition is true. They provide a way to automate repetitive tasks and perform actions based on changing conditions. \nThe basic syntax of a while loop in PHP is as follows:\n beispiel!!!\n Here's how it works:\n 1. The condition is an expression that is evaluated before each iteration of the loop. If the condition is true, the code block inside the while loop is executed. If the condition is false, the loop is exited, and the program continues with the next statement after the loop.\n 2. The code block inside the while loop contains the statements that will be executed repeatedly as long as the condition is true. It is essential to ensure that the code inside the loop includes some logic that will eventually make the condition false; otherwise, the loop will continue indefinitely, resulting in an infinite loop.\n Here's an example to illustrate the usage of a while loop:\n beispiel!!! \n In this example, the initial value of the variable $count is 1. The while loop executes as long as $count is less than or equal to 10. Inside the loop, the value of $count is echoed, followed by a space. Then, the value of $count is incremented by 1 using the $count++ statement. This process continues until $count reaches 11, at which point the condition becomes false, and the loop terminates. \n While loops are useful when you want to repeat a block of code based on a certain condition. They are particularly helpful when the exact number of iterations is not known in advance. However, it's important to ensure that the condition will eventually become false to avoid infinite loops.",
            //         "curriculum_id": 19,
            //         "order_position": 8
            //     }
            // ])


        })
    }

    public getChapters(){
        console.log(this.chapters)
        return this.chapters;
    }

    public getChapter(id:number){
        return this.chapters.find(chapter => chapter.id == id);
    }

    public updateCurrentChapterOrder(newChapterNumber){
        this.currentChapterOrderPosition = newChapterNumber;
    }

    public updateChapters() {
        return new Promise((resolve, reject)=> {
            if(!this.chapters.find(chapter => chapter.order_position == this.currentChapterOrderPosition)){
                console.log(this.currentChapterOrderPosition)
                // this.fetchChapters().then((chapters:[]) => {
                this.apiHelper.getChapters().then((chapters:[]) => {
                    this.chapters = chapters.filter((chapter:ChapterType) => chapter.order_position <= this.currentChapterOrderPosition);
                    resolve(this.chapters)
                }).catch(error => reject(error))
            }else{
                resolve(this.chapters)
            }
        })
    }

    constructor(chapterOrderPosition?:number) {
        this.currentChapterOrderPosition = chapterOrderPosition;
        this.updateChapters().catch(error => console.log(error));
    }
}