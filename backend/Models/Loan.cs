using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Loan
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public int TermInMonths { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Paid

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
} 