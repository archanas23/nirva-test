// Bank API integration for automatic payment verification
export interface BankTransaction {
  id: string;
  amount: number;
  memo: string;
  timestamp: Date;
  sender: string;
  status: 'completed' | 'pending';
}

export interface PaymentVerification {
  id: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  confirmationNumber: string;
  status: 'pending' | 'verified' | 'expired';
  createdAt: Date;
  verifiedAt?: Date;
  classDetails?: any;
  packageDetails?: any;
}

export class BankPaymentVerificationService {
  private static verifications: Map<string, PaymentVerification> = new Map();
  private static verificationInterval: NodeJS.Timeout | null = null;

  // Start automatic verification (call this when app starts)
  static startVerification() {
    if (this.verificationInterval) return;
    
    // Check for payments every 30 seconds
    this.verificationInterval = setInterval(() => {
      this.checkForPayments();
    }, 30000);
  }

  // Stop verification (call this when app stops)
  static stopVerification() {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
      this.verificationInterval = null;
    }
  }

  // Student creates payment verification request
  static createPaymentVerification(data: {
    studentName: string;
    studentEmail: string;
    amount: number;
    classDetails?: any;
    packageDetails?: any;
  }): PaymentVerification {
    const verification: PaymentVerification = {
      id: this.generateVerificationId(),
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      amount: data.amount,
      confirmationNumber: this.generateConfirmationNumber(),
      status: 'pending',
      createdAt: new Date(),
      classDetails: data.classDetails,
      packageDetails: data.packageDetails
    };

    this.verifications.set(verification.id, verification);
    
    // Send payment instructions to student
    this.sendPaymentInstructions(verification);
    
    return verification;
  }

  // Check for payments (this would connect to your bank API)
  private static async checkForPayments() {
    try {
      // In production, this would call your bank's API
      const recentTransactions = await this.getRecentBankTransactions();
      
      // Check each pending verification
      const pendingVerifications = Array.from(this.verifications.values())
        .filter(v => v.status === 'pending' && this.isNotExpired(v));

      for (const verification of pendingVerifications) {
        // Look for matching transaction
        const matchingTransaction = recentTransactions.find(transaction => 
          transaction.amount === verification.amount &&
          transaction.memo.includes(verification.confirmationNumber) &&
          transaction.status === 'completed'
        );

        if (matchingTransaction) {
          await this.verifyPayment(verification.id, matchingTransaction);
        }
      }
    } catch (error) {
      console.error('Error checking for payments:', error);
    }
  }

  // Get recent transactions from bank API
  private static async getRecentBankTransactions(): Promise<BankTransaction[]> {
    // In production, this would call your bank's API
    // For demo, we'll simulate some transactions
    return [
      {
        id: 'txn_123',
        amount: 10,
        memo: 'NY123ABC - John Doe - Vinyasa Flow',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        sender: 'John Doe',
        status: 'completed'
      },
      {
        id: 'txn_456',
        amount: 45,
        memo: 'NY456DEF - Jane Smith - 5-Class Package',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        sender: 'Jane Smith',
        status: 'completed'
      }
    ];
  }

  // Verify payment automatically
  private static async verifyPayment(verificationId: string, transaction: BankTransaction) {
    const verification = this.verifications.get(verificationId);
    if (!verification) return;

    verification.status = 'verified';
    verification.verifiedAt = new Date();
    this.verifications.set(verificationId, verification);

    // Send confirmation email to student
    await this.sendConfirmationEmail(verification);
    
    // Process the booking
    await this.processBooking(verification);
    
    console.log(`Payment verified automatically for ${verification.studentName}`);
  }

  // Get verification by ID
  static getVerification(id: string): PaymentVerification | null {
    return this.verifications.get(id) || null;
  }

  // Get all verifications (for admin)
  static getAllVerifications(): PaymentVerification[] {
    return Array.from(this.verifications.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private static generateVerificationId(): string {
    return 'verify_' + Math.random().toString(36).substring(2, 15);
  }

  private static generateConfirmationNumber(): string {
    return 'NY' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private static isNotExpired(verification: PaymentVerification): boolean {
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - verification.createdAt.getTime() < expirationTime;
  }

  private static async sendPaymentInstructions(verification: PaymentVerification): Promise<void> {
    const emailData = {
      to: verification.studentEmail,
      subject: 'Payment Instructions - Nirva Yoga',
      html: `
        <h2>Payment Instructions</h2>
        <p>Hi ${verification.studentName},</p>
        <p>Please send your Zelle payment to complete your booking:</p>
        
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #0c4a6e; margin: 0 0 8px 0;">Zelle Payment Details</h3>
          <p style="margin: 4px 0;"><strong>Send to:</strong> (805) 807-4894</p>
          <p style="margin: 4px 0;"><strong>Amount:</strong> $${verification.amount}</p>
          <p style="margin: 4px 0;"><strong>Memo:</strong> ${verification.confirmationNumber}</p>
        </div>
        
        <p>Your payment will be automatically verified within 24 hours. You'll receive a confirmation email once verified.</p>
        
        <p>Confirmation Number: ${verification.confirmationNumber}</p>
      `
    };

    console.log('Payment instructions email:', emailData);
  }

  private static async sendConfirmationEmail(verification: PaymentVerification): Promise<void> {
    const emailData = {
      to: verification.studentEmail,
      subject: 'Payment Verified - Your Yoga Class is Confirmed!',
      html: `
        <h2>Payment Verified! 🎉</h2>
        <p>Hi ${verification.studentName},</p>
        <p>Your payment has been automatically verified and your yoga class is confirmed!</p>
        
        ${verification.classDetails ? `
          <h3>Class Details:</h3>
          <p><strong>Class:</strong> ${verification.classDetails.className}</p>
          <p><strong>Teacher:</strong> ${verification.classDetails.teacher}</p>
          <p><strong>Date:</strong> ${verification.classDetails.date}</p>
          <p><strong>Time:</strong> ${verification.classDetails.time}</p>
          <p><strong>Zoom Link:</strong> Will be sent 30 minutes before class</p>
        ` : ''}
        
        ${verification.packageDetails ? `
          <h3>Package Details:</h3>
          <p><strong>Package:</strong> ${verification.packageDetails.packageName}</p>
          <p><strong>Classes Added:</strong> ${verification.packageDetails.packageType === 'five' ? '5' : '10'}</p>
          <p>You can now book classes using your package credits!</p>
        ` : ''}
        
        <p>Thank you for choosing Nirva Yoga!</p>
      `
    };

    console.log('Confirmation email:', emailData);
  }

  private static async processBooking(verification: PaymentVerification): Promise<void> {
    // Process the actual booking
    if (verification.classDetails) {
      // Book single class
      console.log('Processing single class booking:', verification.classDetails);
    } else if (verification.packageDetails) {
      // Process package purchase
      console.log('Processing package purchase:', verification.packageDetails);
    }
  }
}
