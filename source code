#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <stdlib.h>

// Synchronization primitives
sem_t wrt;
pthread_mutex_t mutex;
int readCount = 0;
int tickets = 0;

// Thread argument structures
typedef struct {
    int id;
} ReaderArgs;

typedef struct {
    int id;
    int bookCount;
} WriterArgs;

void* reader(void* arg) {
    ReaderArgs* args = (ReaderArgs*)arg;
    int id = args->id;
    
    // Entry section for readers
    pthread_mutex_lock(&mutex);
    readCount++;
    if (readCount == 1)
        sem_wait(&wrt); // First reader locks writers
    pthread_mutex_unlock(&mutex);
    
    // Critical section - Reading
    printf("\n[Reader %d] Checking tickets... Available Tickets = %d\n", id, tickets);
    sleep(1); // Simulate read time
    
    // Exit section for readers
    pthread_mutex_lock(&mutex);
    readCount--;
    if (readCount == 0)
        sem_post(&wrt); // Last reader unlocks writers
    pthread_mutex_unlock(&mutex);
    
    free(args);
    return NULL;
}

void* writer(void* arg) {
    WriterArgs* args = (WriterArgs*)arg;
    int id = args->id;
    int bookCount = args->bookCount;
    
    // Entry section for writers
    sem_wait(&wrt); // Writer gets exclusive access
    
    // Critical section - Writing
    if (tickets >= bookCount) {
        printf("\n[Writer %d] Booking %d ticket(s)...\n", id, bookCount);
        sleep(1); // Simulate booking time
        tickets -= bookCount;
        printf("[Writer %d] Booking successful! Remaining = %d\n", id, tickets);
    } else if (tickets > 0) {
        printf("\n[Writer %d] Only %d ticket(s) left! Cannot book %d.\n", id, tickets, bookCount);
    } else {
        printf("\n[Writer %d] No tickets available!\n", id);
    }
    
    // Exit section for writers
    sem_post(&wrt);
    
    free(args);
    return NULL;
}

int main() {
    int choice, userId = 1;
    
    // Initialize synchronization primitives
    sem_init(&wrt, 0, 1);
    pthread_mutex_init(&mutex, NULL);
    
    printf("===== E-TICKET BOOKING SYSTEM =====\n");
    printf("Reader-Writer Problem Simulation\n\n");
    
    // Set total tickets
    do {
        printf("Enter total number of tickets available: ");
        scanf("%d", &tickets);
        if (tickets < 0) {
            printf("Invalid input! Please enter a non-negative number.\n");
        }
    } while (tickets < 0);
    
    printf("\nSystem initialized with %d tickets.\n", tickets);
    
    while (1) {
        printf("\n-----------------------------------------\n");
        printf("Menu:\n");
        printf("1. View available tickets (Reader)\n");
        printf("2. Book ticket(s) (Writer)\n");
        printf("3. Exit\n");
        printf("-----------------------------------------\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
        
        if (choice == 1) {
            // Create reader thread
            pthread_t tid;
            ReaderArgs* args = (ReaderArgs*)malloc(sizeof(ReaderArgs));
            args->id = userId++;
            
            pthread_create(&tid, NULL, reader, (void*)args);
            pthread_detach(tid); // Don't wait - allow concurrency
            
            printf("[System] Reader %d started...\n", args->id);
            
        } else if (choice == 2) {
            // Create writer thread
            pthread_t tid;
            WriterArgs* args = (WriterArgs*)malloc(sizeof(WriterArgs));
            args->id = userId++;
            
            do {
                printf("Enter number of tickets to book: ");
                scanf("%d", &args->bookCount);
                if (args->bookCount <= 0) {
                    printf("Invalid input! Please enter a positive number.\n");
                }
            } while (args->bookCount <= 0);
            
            pthread_create(&tid, NULL, writer, (void*)args);
            pthread_detach(tid); // Don't wait - allow concurrency
            
            printf("[System] Writer %d started...\n", args->id);
            
        } else if (choice == 3) {
            printf("\nExiting... Please wait for ongoing operations.\n");
            sleep(2); // Wait for detached threads to finish
            break;
            
        } else {
            printf("\nInvalid choice! Try again.\n");
        }
        
        // Small delay to see concurrent behavior
        usleep(100000); // 0.1 second
    }
    
    // Cleanup
    sem_destroy(&wrt);
    pthread_mutex_destroy(&mutex);
    
    printf("\nThank you for using our system!\n");
    
    return 0;
}
