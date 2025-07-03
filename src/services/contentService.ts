// Content Service for managing educational content
export interface EducationalContent {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
  contentType: 'theory' | 'example' | 'practice' | 'video' | 'notes';
  content: {
    theory?: string;
    examples?: Array<{
      title: string;
      problem: string;
      solution: string;
      explanation: string;
    }>;
    practiceQuestions?: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }>;
    keyPoints?: string[];
    formulas?: Array<{
      name: string;
      formula: string;
      description: string;
    }>;
    diagrams?: Array<{
      title: string;
      description: string;
      imageUrl?: string;
    }>;
  };
  estimatedReadTime: number; // in minutes
  prerequisites: string[];
  nextTopics: string[];
  examRelevance: {
    jeeMain: number; // weightage percentage
    jeeAdvanced: number;
    neet: number;
  };
  lastUpdated: Date;
}

export class ContentService {
  private static instance: ContentService;
  private contentDatabase: Map<string, EducationalContent> = new Map();

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
      ContentService.instance.initializeContent();
    }
    return ContentService.instance;
  }

  private initializeContent(): void {
    // Physics Content
    this.addPhysicsContent();
    // Chemistry Content
    this.addChemistryContent();
    // Mathematics Content
    this.addMathematicsContent();
    // Biology Content
    this.addBiologyContent();
  }

  private addPhysicsContent(): void {
    // Kinematics Content
    const kinematicsContent: EducationalContent = {
      id: 'phy-mech-001-content',
      title: 'Kinematics in One Dimension',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Kinematics',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Kinematics in One Dimension

## Introduction
Kinematics is the branch of mechanics that describes the motion of objects without considering the forces that cause the motion. In one-dimensional motion, an object moves along a straight line.

## Key Concepts

### 1. Position (x)
- Position is the location of an object at a particular time
- It is measured from a reference point (origin)
- Can be positive or negative depending on direction

### 2. Displacement (Δx)
- Change in position: Δx = x₂ - x₁
- Vector quantity (has direction)
- Can be positive, negative, or zero

### 3. Velocity (v)
- Rate of change of displacement
- Average velocity: v_avg = Δx/Δt
- Instantaneous velocity: v = dx/dt
- Vector quantity

### 4. Acceleration (a)
- Rate of change of velocity
- Average acceleration: a_avg = Δv/Δt
- Instantaneous acceleration: a = dv/dt
- Vector quantity

## Motion with Constant Acceleration

When acceleration is constant, we can use the kinematic equations:

1. v = u + at
2. s = ut + ½at²
3. v² = u² + 2as
4. s = (u + v)t/2

Where:
- u = initial velocity
- v = final velocity
- a = acceleration
- t = time
- s = displacement

## Graphical Analysis

### Position-Time Graph
- Slope gives velocity
- Curved line indicates changing velocity
- Straight line indicates constant velocity

### Velocity-Time Graph
- Slope gives acceleration
- Area under curve gives displacement
- Straight line indicates constant acceleration

### Acceleration-Time Graph
- Area under curve gives change in velocity
        `,
        examples: [
          {
            title: 'Uniformly Accelerated Motion',
            problem: 'A car starts from rest and accelerates uniformly at 2 m/s² for 10 seconds. Find: (a) final velocity, (b) distance traveled.',
            solution: `
Given:
- Initial velocity (u) = 0 m/s
- Acceleration (a) = 2 m/s²
- Time (t) = 10 s

(a) Final velocity:
Using v = u + at
v = 0 + 2 × 10 = 20 m/s

(b) Distance traveled:
Using s = ut + ½at²
s = 0 × 10 + ½ × 2 × 10²
s = 0 + 1 × 100 = 100 m
            `,
            explanation: 'This is a classic uniformly accelerated motion problem. We use the kinematic equations to find the required quantities.'
          },
          {
            title: 'Free Fall Motion',
            problem: 'A ball is dropped from a height of 45 m. Find the time taken to reach the ground and the velocity just before hitting the ground. (g = 10 m/s²)',
            solution: `
Given:
- Initial velocity (u) = 0 m/s (dropped)
- Displacement (s) = 45 m (downward)
- Acceleration (a) = g = 10 m/s² (downward)

Time to reach ground:
Using s = ut + ½at²
45 = 0 × t + ½ × 10 × t²
45 = 5t²
t² = 9
t = 3 s

Velocity just before hitting ground:
Using v = u + at
v = 0 + 10 × 3 = 30 m/s
            `,
            explanation: 'Free fall is a special case of uniformly accelerated motion where acceleration equals gravitational acceleration.'
          }
        ],
        practiceQuestions: [
          {
            question: 'A particle moves with constant acceleration. If it covers 100 m in the first 10 s and 150 m in the next 10 s, what is its acceleration?',
            options: ['2.5 m/s²', '5 m/s²', '7.5 m/s²', '10 m/s²'],
            correctAnswer: 0,
            explanation: 'Using kinematic equations for the two intervals and solving simultaneously gives a = 2.5 m/s².',
            difficulty: 'Medium'
          },
          {
            question: 'The area under a velocity-time graph represents:',
            options: ['Acceleration', 'Displacement', 'Force', 'Momentum'],
            correctAnswer: 1,
            explanation: 'The area under a velocity-time graph gives the displacement of the object.',
            difficulty: 'Easy'
          }
        ],
        keyPoints: [
          'Kinematics deals with motion description, not causes',
          'Displacement is vector, distance is scalar',
          'Acceleration can be positive, negative, or zero',
          'Kinematic equations apply only for constant acceleration',
          'Graphical methods provide visual understanding of motion'
        ],
        formulas: [
          {
            name: 'First Equation of Motion',
            formula: 'v = u + at',
            description: 'Relates final velocity, initial velocity, acceleration, and time'
          },
          {
            name: 'Second Equation of Motion',
            formula: 's = ut + ½at²',
            description: 'Relates displacement, initial velocity, acceleration, and time'
          },
          {
            name: 'Third Equation of Motion',
            formula: 'v² = u² + 2as',
            description: 'Relates velocities, acceleration, and displacement (time-independent)'
          }
        ]
      },
      estimatedReadTime: 25,
      prerequisites: [],
      nextTopics: ['phy-mech-002', 'phy-mech-003'],
      examRelevance: {
        jeeMain: 12,
        jeeAdvanced: 10,
        neet: 8
      },
      lastUpdated: new Date()
    };

    // Newton's Laws Content
    const newtonsLawsContent: EducationalContent = {
      id: 'phy-mech-003-content',
      title: 'Newton\'s Laws of Motion',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Dynamics',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Newton's Laws of Motion

## Introduction
Newton's laws of motion are three fundamental laws that form the foundation of classical mechanics. They describe the relationship between forces acting on a body and its motion.

## First Law (Law of Inertia)
**Statement**: An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an external force.

### Key Points:
- Defines the concept of inertia
- Introduces the idea of reference frames
- Valid only in inertial reference frames

### Mathematical Form:
If ΣF = 0, then v = constant

## Second Law (Law of Acceleration)
**Statement**: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

### Mathematical Form:
F = ma

Where:
- F = net force (N)
- m = mass (kg)
- a = acceleration (m/s²)

### Important Notes:
- Force and acceleration are vectors
- Net force is the vector sum of all forces
- Mass is a scalar quantity

## Third Law (Action-Reaction Law)
**Statement**: For every action, there is an equal and opposite reaction.

### Key Points:
- Forces always occur in pairs
- Action and reaction forces act on different objects
- They are equal in magnitude but opposite in direction

### Mathematical Form:
F₁₂ = -F₂₁

## Applications and Problem Solving

### Free Body Diagrams
1. Identify the object of interest
2. Draw all forces acting on the object
3. Choose coordinate system
4. Apply Newton's second law in component form

### Common Force Types:
- Weight: W = mg (downward)
- Normal force: N (perpendicular to surface)
- Friction: f = μN (opposing motion)
- Tension: T (along string/rope)
- Applied force: F (as given)

## Problem-Solving Strategy
1. Draw free body diagram
2. Choose coordinate system
3. Apply ΣF = ma in each direction
4. Solve the resulting equations
5. Check the reasonableness of answer
        `,
        examples: [
          {
            title: 'Block on Inclined Plane',
            problem: 'A 5 kg block slides down a frictionless inclined plane of angle 30°. Find the acceleration of the block.',
            solution: `
Given:
- Mass (m) = 5 kg
- Angle (θ) = 30°
- Friction = 0

Free Body Diagram:
- Weight: mg = 5 × 10 = 50 N (vertically downward)
- Normal force: N (perpendicular to incline)

Resolving weight:
- Component along incline: mg sin θ = 50 × sin 30° = 25 N
- Component perpendicular to incline: mg cos θ = 50 × cos 30° = 43.3 N

Applying Newton's second law along the incline:
ma = mg sin θ
a = g sin θ = 10 × sin 30° = 5 m/s²
            `,
            explanation: 'The acceleration depends only on the angle of incline and is independent of mass for frictionless surfaces.'
          }
        ],
        practiceQuestions: [
          {
            question: 'A force of 20 N acts on a 4 kg mass. What is the acceleration produced?',
            options: ['5 m/s²', '10 m/s²', '80 m/s²', '0.2 m/s²'],
            correctAnswer: 0,
            explanation: 'Using F = ma, a = F/m = 20/4 = 5 m/s²',
            difficulty: 'Easy'
          }
        ],
        keyPoints: [
          'Newton\'s laws are valid only in inertial reference frames',
          'Force is a vector quantity - direction matters',
          'Action-reaction pairs act on different objects',
          'Free body diagrams are essential for problem solving',
          'Net force determines acceleration, not individual forces'
        ],
        formulas: [
          {
            name: 'Newton\'s Second Law',
            formula: 'F = ma',
            description: 'Net force equals mass times acceleration'
          },
          {
            name: 'Weight',
            formula: 'W = mg',
            description: 'Weight is the gravitational force on an object'
          }
        ]
      },
      estimatedReadTime: 30,
      prerequisites: ['phy-mech-001'],
      nextTopics: ['phy-mech-004', 'phy-mech-005'],
      examRelevance: {
        jeeMain: 15,
        jeeAdvanced: 12,
        neet: 10
      },
      lastUpdated: new Date()
    };

    this.contentDatabase.set('phy-mech-001', kinematicsContent);
    this.contentDatabase.set('phy-mech-003', newtonsLawsContent);
  }

  private addChemistryContent(): void {
    const atomicStructureContent: EducationalContent = {
      id: 'chem-phys-001-content',
      title: 'Atomic Structure Fundamentals',
      subject: 'Chemistry',
      topic: 'Physical Chemistry',
      subtopic: 'Atomic Structure',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Atomic Structure Fundamentals

## Introduction
Atomic structure is the foundation of chemistry. Understanding how atoms are built and how electrons are arranged helps explain chemical bonding, properties, and reactions.

## Historical Development

### Dalton's Atomic Theory (1808)
- Matter consists of indivisible atoms
- All atoms of an element are identical
- Compounds form by combination of atoms in simple ratios

### Thomson's Model (1897)
- Discovery of electron
- "Plum pudding" model
- Atom as sphere of positive charge with embedded electrons

### Rutherford's Model (1911)
- Nuclear model of atom
- Dense, positively charged nucleus
- Electrons orbit the nucleus

### Bohr's Model (1913)
- Electrons in fixed orbits
- Quantized energy levels
- Explained hydrogen spectrum

## Modern Atomic Theory

### Quantum Mechanical Model
- Electrons exist in orbitals (probability regions)
- Wave-particle duality
- Heisenberg uncertainty principle

### Quantum Numbers
1. **Principal quantum number (n)**
   - Energy level (1, 2, 3, ...)
   - Distance from nucleus

2. **Azimuthal quantum number (l)**
   - Subshell type (s, p, d, f)
   - Shape of orbital
   - Values: 0 to (n-1)

3. **Magnetic quantum number (m)**
   - Orientation of orbital
   - Values: -l to +l

4. **Spin quantum number (s)**
   - Electron spin direction
   - Values: +½ or -½

## Electronic Configuration

### Aufbau Principle
- Electrons fill orbitals in order of increasing energy
- Energy order: 1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p...

### Pauli Exclusion Principle
- No two electrons can have identical quantum numbers
- Maximum 2 electrons per orbital with opposite spins

### Hund's Rule
- Electrons singly occupy orbitals before pairing
- Parallel spins in degenerate orbitals

## Periodic Trends

### Atomic Radius
- Decreases across period (increasing nuclear charge)
- Increases down group (additional electron shells)

### Ionization Energy
- Energy required to remove electron
- Increases across period
- Decreases down group

### Electron Affinity
- Energy released when electron is added
- Generally increases across period
- Varies down group
        `,
        examples: [
          {
            title: 'Electronic Configuration',
            problem: 'Write the electronic configuration of Chromium (Z = 24) and explain any anomaly.',
            solution: `
Expected configuration: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁴
Actual configuration: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d⁵

Explanation:
The actual configuration shows an anomaly where one electron from 4s moves to 3d orbital. This happens because:
1. Half-filled d subshell (d⁵) provides extra stability
2. The energy difference between 4s and 3d is small
3. Exchange energy stabilization in d⁵ configuration

This anomaly also occurs in Copper (Cu) where d¹⁰ configuration is preferred.
            `,
            explanation: 'Chromium and Copper show electronic configuration anomalies due to stability of half-filled and completely filled d orbitals.'
          }
        ],
        practiceQuestions: [
          {
            question: 'Which of the following has the maximum number of unpaired electrons?',
            options: ['N (Z=7)', 'O (Z=8)', 'F (Z=9)', 'Ne (Z=10)'],
            correctAnswer: 0,
            explanation: 'N has configuration 1s² 2s² 2p³ with 3 unpaired electrons in 2p orbitals (following Hund\'s rule).',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Quantum numbers completely describe an electron in an atom',
          'Electronic configuration determines chemical properties',
          'Stability of half-filled and filled subshells causes anomalies',
          'Periodic trends are explained by atomic structure',
          'Orbitals are probability regions, not fixed paths'
        ],
        formulas: [
          {
            name: 'Maximum electrons in shell',
            formula: '2n²',
            description: 'Maximum number of electrons in nth shell'
          },
          {
            name: 'Maximum electrons in subshell',
            formula: '2(2l+1)',
            description: 'Maximum electrons in subshell with azimuthal quantum number l'
          }
        ]
      },
      estimatedReadTime: 35,
      prerequisites: [],
      nextTopics: ['chem-phys-002'],
      examRelevance: {
        jeeMain: 8,
        jeeAdvanced: 6,
        neet: 12
      },
      lastUpdated: new Date()
    };

    this.contentDatabase.set('chem-phys-001', atomicStructureContent);
  }

  private addMathematicsContent(): void {
    const limitsContent: EducationalContent = {
      id: 'math-calc-001-content',
      title: 'Limits and Continuity',
      subject: 'Mathematics',
      topic: 'Calculus',
      subtopic: 'Limits',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Limits and Continuity

## Introduction to Limits
The concept of limit is fundamental to calculus. It describes the behavior of a function as the input approaches a particular value.

## Definition of Limit
The limit of f(x) as x approaches a is L, written as:

lim(x→a) f(x) = L

This means that f(x) can be made arbitrarily close to L by taking x sufficiently close to a.

## Types of Limits

### 1. Finite Limits
When the limit exists and is a finite number.

### 2. Infinite Limits
When the function approaches ±∞ as x approaches a.

### 3. Limits at Infinity
When x approaches ±∞.

## Standard Limits
1. lim(x→0) (sin x)/x = 1
2. lim(x→0) (1 - cos x)/x = 0
3. lim(x→0) (eˣ - 1)/x = 1
4. lim(x→0) (ln(1 + x))/x = 1
5. lim(x→0) (aˣ - 1)/x = ln a
6. lim(x→∞) (1 + 1/x)ˣ = e

## Methods of Evaluation

### 1. Direct Substitution
If f(x) is continuous at x = a, then lim(x→a) f(x) = f(a)

### 2. Factorization
For 0/0 forms, factor and cancel common terms.

### 3. Rationalization
Multiply by conjugate to eliminate radicals.

### 4. L'Hôpital's Rule
For 0/0 or ∞/∞ forms:
lim(x→a) f(x)/g(x) = lim(x→a) f'(x)/g'(x)

### 5. Standard Substitutions
Use trigonometric or exponential substitutions.

## Indeterminate Forms
- 0/0
- ∞/∞
- 0 × ∞
- ∞ - ∞
- 0⁰
- 1^∞
- ∞⁰

## Continuity
A function f(x) is continuous at x = a if:
1. f(a) is defined
2. lim(x→a) f(x) exists
3. lim(x→a) f(x) = f(a)

### Types of Discontinuity
1. **Removable**: Limit exists but ≠ f(a)
2. **Jump**: Left and right limits exist but are unequal
3. **Infinite**: Function approaches ±∞

## Properties of Continuous Functions
1. Sum, difference, product of continuous functions is continuous
2. Quotient is continuous where denominator ≠ 0
3. Composition of continuous functions is continuous
4. Intermediate Value Theorem
5. Extreme Value Theorem
        `,
        examples: [
          {
            title: 'Evaluating 0/0 Form',
            problem: 'Evaluate lim(x→2) (x² - 4)/(x - 2)',
            solution: `
Direct substitution gives 0/0 form.

Method 1 - Factorization:
lim(x→2) (x² - 4)/(x - 2)
= lim(x→2) (x + 2)(x - 2)/(x - 2)
= lim(x→2) (x + 2)    [canceling (x - 2)]
= 2 + 2 = 4

Method 2 - L'Hôpital's Rule:
lim(x→2) (x² - 4)/(x - 2)
= lim(x→2) (2x)/(1)    [differentiating numerator and denominator]
= 2(2) = 4
            `,
            explanation: 'Both factorization and L\'Hôpital\'s rule give the same result. Factorization is often simpler for polynomial functions.'
          },
          {
            title: 'Trigonometric Limit',
            problem: 'Evaluate lim(x→0) (1 - cos x)/x²',
            solution: `
Direct substitution gives 0/0 form.

Using the identity: 1 - cos x = 2sin²(x/2)

lim(x→0) (1 - cos x)/x²
= lim(x→0) 2sin²(x/2)/x²
= lim(x→0) 2sin²(x/2)/(4(x/2)²)
= lim(x→0) (1/2) × [sin(x/2)/(x/2)]²
= (1/2) × 1² = 1/2

Using standard limit: lim(t→0) sin t/t = 1
            `,
            explanation: 'This limit is often used as a standard result. The key is to manipulate the expression to use known standard limits.'
          }
        ],
        practiceQuestions: [
          {
            question: 'What is lim(x→0) (sin 3x)/(sin 5x)?',
            options: ['3/5', '5/3', '1', '0'],
            correctAnswer: 0,
            explanation: 'Using lim(x→0) sin(ax)/sin(bx) = a/b, we get 3/5.',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Limits describe function behavior near a point',
          'Direct substitution works for continuous functions',
          'Standard limits are essential tools',
          'L\'Hôpital\'s rule applies to indeterminate forms',
          'Continuity requires limit to equal function value'
        ],
        formulas: [
          {
            name: 'Standard Trigonometric Limit',
            formula: 'lim(x→0) (sin x)/x = 1',
            description: 'Fundamental trigonometric limit'
          },
          {
            name: 'L\'Hôpital\'s Rule',
            formula: 'lim(x→a) f(x)/g(x) = lim(x→a) f\'(x)/g\'(x)',
            description: 'For 0/0 or ∞/∞ indeterminate forms'
          }
        ]
      },
      estimatedReadTime: 40,
      prerequisites: [],
      nextTopics: ['math-calc-002'],
      examRelevance: {
        jeeMain: 18,
        jeeAdvanced: 15,
        neet: 0
      },
      lastUpdated: new Date()
    };

    this.contentDatabase.set('math-calc-001', limitsContent);
  }

  private addBiologyContent(): void {
    const cellStructureContent: EducationalContent = {
      id: 'bio-cell-001-content',
      title: 'Cell Structure and Function',
      subject: 'Biology',
      topic: 'Cell Biology',
      subtopic: 'Cell Structure',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Cell Structure and Function

## Introduction
The cell is the basic structural and functional unit of life. All living organisms are composed of one or more cells, making cell biology fundamental to understanding life processes.

## Cell Theory
1. All living things are composed of cells
2. The cell is the basic unit of life
3. All cells arise from pre-existing cells

## Types of Cells

### Prokaryotic Cells
- No membrane-bound nucleus
- Genetic material freely distributed in cytoplasm
- Examples: Bacteria, Archaea

**Characteristics:**
- Simple internal structure
- Cell wall present
- Ribosomes (70S type)
- No membrane-bound organelles

### Eukaryotic Cells
- Membrane-bound nucleus
- Genetic material enclosed in nucleus
- Examples: Plants, Animals, Fungi, Protists

**Characteristics:**
- Complex internal structure
- Membrane-bound organelles
- Ribosomes (80S type)
- Compartmentalization

## Cell Organelles and Their Functions

### 1. Nucleus
- **Function**: Control center of cell, contains DNA
- **Structure**: Nuclear envelope, nucleoplasm, nucleolus
- **Importance**: Gene expression, DNA replication

### 2. Mitochondria
- **Function**: Powerhouse of cell, ATP production
- **Structure**: Double membrane, cristae, matrix
- **Importance**: Cellular respiration, energy metabolism

### 3. Endoplasmic Reticulum (ER)
**Rough ER:**
- Ribosomes attached
- Protein synthesis and modification
- Transport of proteins

**Smooth ER:**
- No ribosomes
- Lipid synthesis
- Detoxification

### 4. Golgi Apparatus
- **Function**: Processing, packaging, shipping
- **Structure**: Stacks of flattened membranes (cisternae)
- **Importance**: Protein modification, secretion

### 5. Ribosomes
- **Function**: Protein synthesis
- **Types**: Free ribosomes, bound ribosomes
- **Structure**: Large and small subunits

### 6. Lysosomes
- **Function**: Digestive organelles
- **Contents**: Digestive enzymes
- **Importance**: Waste disposal, autophagy

### 7. Vacuoles
**Plant Cells:**
- Large central vacuole
- Maintains turgor pressure
- Storage of water and substances

**Animal Cells:**
- Small, temporary vacuoles
- Specific functions (food, contractile)

### 8. Chloroplasts (Plant Cells Only)
- **Function**: Photosynthesis
- **Structure**: Double membrane, thylakoids, stroma
- **Importance**: Light energy conversion

## Cell Membrane Structure

### Fluid Mosaic Model
- Phospholipid bilayer
- Embedded proteins
- Cholesterol molecules
- Carbohydrate chains

### Functions:
1. Selective permeability
2. Cell recognition
3. Signal transduction
4. Transport of materials

## Transport Across Cell Membrane

### Passive Transport
1. **Simple Diffusion**: Movement along concentration gradient
2. **Facilitated Diffusion**: Through protein channels
3. **Osmosis**: Water movement through semipermeable membrane

### Active Transport
1. **Primary Active Transport**: Direct use of ATP
2. **Secondary Active Transport**: Indirect use of ATP
3. **Bulk Transport**: Endocytosis and exocytosis

## Cell Wall (Plant Cells)
- **Composition**: Cellulose, hemicellulose, pectin
- **Functions**: 
  - Structural support
  - Protection
  - Shape maintenance
  - Prevents over-expansion

## Cytoskeleton
- **Components**: Microfilaments, microtubules, intermediate filaments
- **Functions**:
  - Cell shape maintenance
  - Organelle movement
  - Cell division
  - Muscle contraction
        `,
        examples: [
          {
            title: 'Osmosis in Plant Cells',
            problem: 'Explain what happens when a plant cell is placed in a hypotonic solution.',
            solution: `
When a plant cell is placed in a hypotonic solution:

1. **Water Movement**: Water moves into the cell due to higher solute concentration inside
2. **Cell Swelling**: The cell contents swell and press against the cell wall
3. **Turgor Pressure**: Pressure builds up against the rigid cell wall
4. **Turgid State**: The cell becomes turgid (firm and swollen)
5. **Equilibrium**: The cell wall prevents bursting, and equilibrium is reached

This process is crucial for:
- Maintaining plant structure
- Opening and closing of stomata
- Growth and development
- Transport of materials
            `,
            explanation: 'The rigid cell wall in plants prevents the cell from bursting in hypotonic conditions, unlike animal cells which would lyse.'
          }
        ],
        practiceQuestions: [
          {
            question: 'Which organelle is known as the "powerhouse of the cell"?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
            correctAnswer: 1,
            explanation: 'Mitochondria are called the powerhouse because they produce ATP through cellular respiration.',
            difficulty: 'Easy'
          },
          {
            question: 'The fluid mosaic model describes the structure of:',
            options: ['Cell wall', 'Cell membrane', 'Nucleus', 'Cytoplasm'],
            correctAnswer: 1,
            explanation: 'The fluid mosaic model explains the structure of cell membrane with phospholipid bilayer and embedded proteins.',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Cells are the basic units of life',
          'Prokaryotic and eukaryotic cells have distinct features',
          'Each organelle has specific functions',
          'Cell membrane controls what enters and exits the cell',
          'Plant and animal cells have some unique organelles'
        ],
        formulas: [
          {
            name: 'Surface Area to Volume Ratio',
            formula: 'SA:V = 6/r (for sphere)',
            description: 'Determines efficiency of material exchange'
          }
        ]
      },
      estimatedReadTime: 30,
      prerequisites: [],
      nextTopics: ['bio-cell-002'],
      examRelevance: {
        jeeMain: 0,
        jeeAdvanced: 0,
        neet: 15
      },
      lastUpdated: new Date()
    };

    this.contentDatabase.set('bio-cell-001', cellStructureContent);
  }

  // Public methods
  getContent(nodeId: string): EducationalContent | null {
    return this.contentDatabase.get(nodeId) || null;
  }

  getContentBySubject(subject: string): EducationalContent[] {
    return Array.from(this.contentDatabase.values())
      .filter(content => content.subject === subject);
  }

  getContentByTopic(subject: string, topic: string): EducationalContent[] {
    return Array.from(this.contentDatabase.values())
      .filter(content => content.subject === subject && content.topic === topic);
  }

  searchContent(query: string): EducationalContent[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.contentDatabase.values())
      .filter(content => 
        content.title.toLowerCase().includes(searchTerm) ||
        content.topic.toLowerCase().includes(searchTerm) ||
        content.subtopic.toLowerCase().includes(searchTerm) ||
        content.content.theory?.toLowerCase().includes(searchTerm)
      );
  }

  addCustomContent(content: EducationalContent): void {
    this.contentDatabase.set(content.id, content);
  }

  updateContent(id: string, updates: Partial<EducationalContent>): void {
    const existing = this.contentDatabase.get(id);
    if (existing) {
      const updated = { ...existing, ...updates, lastUpdated: new Date() };
      this.contentDatabase.set(id, updated);
    }
  }

  getAllContent(): EducationalContent[] {
    return Array.from(this.contentDatabase.values());
  }
}

export const contentService = ContentService.getInstance();