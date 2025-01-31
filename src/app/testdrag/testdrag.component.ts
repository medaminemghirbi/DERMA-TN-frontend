import { Component, OnInit } from '@angular/core';

interface Item {
  title: string;
  description: string;
}

@Component({
  selector: 'app-testdrag',
  templateUrl: './testdrag.component.html',
  styleUrls: ['./testdrag.component.css']
})
export class TestdragComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  // Sample items with titles and descriptions
  items: Item[] = [
    { title: 'Task 1', description: 'This is task 1 description.' },
    { title: 'Task 2', description: 'This is task 2 description.' },
    { title: 'Task 3', description: 'This is task 3 description.' },
    { title: 'Task 4', description: 'This is task 4 description.' }
  ];

  completedItems: Item[] = []; // Completed items

  // Track which item is being dragged
  draggingIndex: number | null = null;

  // Handle drag start event
  onDragStart(index: number) {
    this.draggingIndex = index;
  }

  // Allow drop by preventing the default behavior
  onDragOver(event: DragEvent) {
    event.preventDefault();  // Needed to allow drop
  }

  // Handle item drop
  onDrop() {
    if (this.draggingIndex !== null) {
      const droppedItem = this.items[this.draggingIndex];
      this.completedItems.push(droppedItem);  // Move to Completed
      this.items.splice(this.draggingIndex, 1);  // Remove from Available Items
      this.draggingIndex = null;  // Reset dragging index
    }
  }
}
