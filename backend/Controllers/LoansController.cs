using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoansController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Loans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
        {
            return await _context.Loans
                .Include(l => l.User)
                .ToListAsync();
        }

        // GET: api/Loans/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Loan>> GetLoan(int id)
        {
            var loan = await _context.Loans
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (loan == null)
            {
                return NotFound();
            }

            return loan;
        }

        // GET: api/Loans/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Loan>>> GetUserLoans(int userId)
        {
            return await _context.Loans
                .Where(l => l.UserId == userId)
                .Include(l => l.User)
                .ToListAsync();
        }

        // POST: api/Loans
        [HttpPost]
        public async Task<ActionResult<Loan>> CreateLoan(Loan loan)
        {
            try
            {
                // Handle user separately to avoid duplicate email issues
                if (loan.User != null)
                {
                    // Check if user with this email already exists
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == loan.User.Email);
                    
                    if (existingUser != null)
                    {
                        // Use existing user
                        loan.UserId = existingUser.Id;
                    }
                    else
                    {
                        // Create new user
                        var newUser = new User
                        {
                            Name = loan.User.Name,
                            Email = loan.User.Email,
                            // Copy other necessary properties
                        };
                        
                        _context.Users.Add(newUser);
                        await _context.SaveChangesAsync();
                        
                        // Set the user ID to the newly created user
                        loan.UserId = newUser.Id;
                    }
                    
                    // Clear the navigation property to prevent EF from tracking it
                    loan.User = null;
                }
                
                // Create the loan
                _context.Loans.Add(loan);
                await _context.SaveChangesAsync();
                
                // Load the user for the response
                var createdLoan = await _context.Loans
                    .Include(l => l.User)
                    .FirstOrDefaultAsync(l => l.Id == loan.Id);
                
                return CreatedAtAction(nameof(GetLoan), new { id = loan.Id }, createdLoan);
            }
            catch (DbUpdateException ex)
            {
                // Log the exception details
                return StatusCode(500, $"An error occurred while creating the loan: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        // PUT: api/Loans/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLoan(int id, Loan loan)
        {
            if (id != loan.Id)
            {
                return BadRequest();
            }

            loan.UpdatedAt = DateTime.UtcNow;
            _context.Entry(loan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoanExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Loans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
            {
                return NotFound();
            }

            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoanExists(int id)
        {
            return _context.Loans.Any(e => e.Id == id);
        }
    }
} 