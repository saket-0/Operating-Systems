# operating-system-project
E-Ticket Booking System (Reader-Writer Problem)
Overview

This project simulates an E-Ticket Booking System using the Reader-Writer Problem concept in C.
It demonstrates how multiple readers (users checking ticket availability) and writers (users booking tickets) can safely access a shared ticket database using threads, mutexes, and semaphores to prevent race conditions.

The behavior closely resembles real-world platforms like IRCTC or BookMyShow, where ticket data must be updated atomically to prevent inconsistencies.

Features

Simulates concurrent Readers and Writers accessing shared data.

Uses POSIX threads (pthreads) for multithreading.

Ensures synchronization using Mutex and Semaphore.

Prevents data inconsistency and race conditions.

Interactive menu-driven interface.

Demonstrates real-time concurrency.



 How to Run

Clone this repository:

git clone https://github.com/saket-0/operating-system-project.git


Navigate to the folder:

cd operating-system-project


Compile the code:

gcc -o ticket_system ticket_system.c -lpthread


Run the executable:

./ticket_system


(If using Windows with Geany or Code::Blocks, just open and run the file.)

🧠 Concept Explanation

Readers → Users who view available tickets. Multiple readers can access data simultaneously.

Writers → Users who book tickets. Writers need exclusive access to modify the data.

Mutex → Ensures mutual exclusion among readers updating readCount.

Semaphore (wrt) → Allows only one writer or multiple readers at a time.

Shared Resource → Total number of tickets available.

This synchronization ensures that no ticket data inconsistency occurs even under concurrent operations.
