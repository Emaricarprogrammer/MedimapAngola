// src/Utils/Errors/CustomErrors.ts

export class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ValidationError";
    }
  }
  
  export class DatabaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "DatabaseError";
    }
  }
  
  export class AuthenticationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "AuthenticationError";
    }
  }
  
  export class NotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "NotFoundError";
    }
  }
  
  export class InternalServerError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InternalServerError";
    }
  }
  