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
    // Physics Content - Comprehensive JEE/NEET Coverage
    this.addPhysicsContent();
    // Chemistry Content
    this.addChemistryContent();
    // Mathematics Content
    this.addMathematicsContent();
    // Biology Content
    this.addBiologyContent();
  }

  private addPhysicsContent(): void {
    // Mechanics - Kinematics
    const kinematicsContent: EducationalContent = {
      id: 'phy-mech-001-content',
      title: 'Motion in a Straight Line',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Kinematics',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Motion in a Straight Line

## Introduction
Motion is one of the most fundamental concepts in physics. When we describe the motion of an object, we are describing how its position changes with time.

## Key Concepts

### 1. Position and Displacement
- **Position (x)**: Location of an object at any given time
- **Displacement (Δx)**: Change in position = x₂ - x₁
- Displacement is a vector quantity (has direction)

### 2. Velocity
- **Average Velocity**: v_avg = Δx/Δt
- **Instantaneous Velocity**: v = dx/dt
- Velocity is also a vector quantity

### 3. Acceleration
- **Average Acceleration**: a_avg = Δv/Δt  
- **Instantaneous Acceleration**: a = dv/dt
- Acceleration can be positive (speeding up) or negative (slowing down)

## Equations of Motion (Constant Acceleration)

For motion with constant acceleration, we have three fundamental equations:

1. **v = u + at**
   - Relates velocity, initial velocity, acceleration, and time

2. **s = ut + ½at²**
   - Relates displacement, initial velocity, acceleration, and time

3. **v² = u² + 2as**
   - Relates velocities, acceleration, and displacement (time-independent)

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

## Free Fall Motion
Special case where acceleration = g = 9.8 m/s² (downward)
- All objects fall with same acceleration (ignoring air resistance)
- Use same kinematic equations with a = g

## Problem-Solving Strategy
1. Identify given quantities and what to find
2. Choose appropriate kinematic equation
3. Substitute values carefully (watch signs!)
4. Solve algebraically before substituting numbers
5. Check if answer makes physical sense
        `,
        examples: [
          {
            title: 'Uniformly Accelerated Motion',
            problem: 'A car starts from rest and accelerates uniformly at 2 m/s² for 10 seconds. Find: (a) final velocity, (b) distance traveled.',
            solution: `
**Given:**
- Initial velocity (u) = 0 m/s (starts from rest)
- Acceleration (a) = 2 m/s²
- Time (t) = 10 s

**To find:** (a) Final velocity (v), (b) Distance traveled (s)

**Solution:**

(a) Finding final velocity:
Using the equation: v = u + at
v = 0 + (2)(10)
v = 20 m/s

(b) Finding distance traveled:
Using the equation: s = ut + ½at²
s = (0)(10) + ½(2)(10)²
s = 0 + 1(100)
s = 100 m

**Alternative method for (b):**
Using: v² = u² + 2as
(20)² = (0)² + 2(2)s
400 = 4s
s = 100 m ✓

**Answer:** (a) 20 m/s, (b) 100 m
            `,
            explanation: 'This is a classic uniformly accelerated motion problem. Notice how we can use different equations to verify our answer. Always check your work using an alternative method when possible.'
          },
          {
            title: 'Free Fall Problem',
            problem: 'A ball is dropped from a height of 45 m. Find: (a) time to reach ground, (b) velocity just before hitting ground. (Take g = 10 m/s²)',
            solution: `
**Given:**
- Initial velocity (u) = 0 m/s (dropped, not thrown)
- Displacement (s) = 45 m (downward, taking downward as positive)
- Acceleration (a) = g = 10 m/s² (downward)

**To find:** (a) Time (t), (b) Final velocity (v)

**Solution:**

(a) Finding time to reach ground:
Using: s = ut + ½at²
45 = (0)(t) + ½(10)t²
45 = 5t²
t² = 9
t = 3 s

(b) Finding velocity just before hitting ground:
Using: v = u + at
v = 0 + (10)(3)
v = 30 m/s

**Verification using v² = u² + 2as:**
v² = (0)² + 2(10)(45)
v² = 900
v = 30 m/s ✓

**Answer:** (a) 3 seconds, (b) 30 m/s
            `,
            explanation: 'Free fall is a special case of uniformly accelerated motion. The key insight is that all objects fall with the same acceleration regardless of their mass (ignoring air resistance).'
          },
          {
            title: 'Motion with Initial Velocity',
            problem: 'A ball is thrown vertically upward with initial velocity 30 m/s. Find: (a) maximum height reached, (b) time to return to starting point. (g = 10 m/s²)',
            solution: `
**Given:**
- Initial velocity (u) = 30 m/s (upward, taking upward as positive)
- Acceleration (a) = -g = -10 m/s² (downward)

**To find:** (a) Maximum height (h), (b) Total time of flight (T)

**Solution:**

(a) Finding maximum height:
At maximum height, final velocity v = 0
Using: v² = u² + 2as
(0)² = (30)² + 2(-10)h
0 = 900 - 20h
h = 45 m

(b) Finding time to return to starting point:
For complete journey, displacement s = 0
Using: s = ut + ½at²
0 = 30t + ½(-10)t²
0 = 30t - 5t²
0 = t(30 - 5t)
t = 0 (starting point) or t = 6 s (return point)

Therefore, T = 6 s

**Verification:**
Time to reach maximum height: v = u + at
0 = 30 + (-10)t₁
t₁ = 3 s
Total time = 2 × 3 = 6 s ✓

**Answer:** (a) 45 m, (b) 6 s
            `,
            explanation: 'For projectile motion, the time to go up equals the time to come down. The ball returns to its starting point with the same speed but opposite direction.'
          }
        ],
        practiceQuestions: [
          {
            question: 'A particle moves with constant acceleration. If it covers 100 m in the first 10 s and 150 m in the next 10 s, what is its acceleration?',
            options: ['2.5 m/s²', '5 m/s²', '7.5 m/s²', '10 m/s²'],
            correctAnswer: 0,
            explanation: 'For the first 10s: s₁ = u₁t + ½at² = 100. For the next 10s: s₂ = u₂t + ½at² = 150. Since u₂ = u₁ + at, solving these equations simultaneously gives a = 2.5 m/s².',
            difficulty: 'Medium'
          },
          {
            question: 'The area under a velocity-time graph represents:',
            options: ['Acceleration', 'Displacement', 'Force', 'Momentum'],
            correctAnswer: 1,
            explanation: 'The area under a velocity-time graph gives the displacement of the object. This is a fundamental concept in kinematics.',
            difficulty: 'Easy'
          },
          {
            question: 'A stone is thrown vertically upward with speed 20 m/s. After how much time will it return to the thrower? (g = 10 m/s²)',
            options: ['2 s', '4 s', '6 s', '8 s'],
            correctAnswer: 1,
            explanation: 'Using s = ut + ½at² with s = 0 (returns to starting point): 0 = 20t - 5t². Solving: t = 4 s.',
            difficulty: 'Medium'
          },
          {
            question: 'Which of the following is a scalar quantity?',
            options: ['Velocity', 'Acceleration', 'Displacement', 'Speed'],
            correctAnswer: 3,
            explanation: 'Speed is a scalar quantity as it has only magnitude. Velocity, acceleration, and displacement are vector quantities as they have both magnitude and direction.',
            difficulty: 'Easy'
          },
          {
            question: 'A car moving at 60 km/h is brought to rest in 10 s. The retardation is:',
            options: ['1.67 m/s²', '6 m/s²', '16.7 m/s²', '60 m/s²'],
            correctAnswer: 0,
            explanation: 'First convert: 60 km/h = 60 × (5/18) = 16.67 m/s. Using v = u + at: 0 = 16.67 + a(10). Therefore a = -1.67 m/s². The magnitude of retardation is 1.67 m/s².',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Motion is described by position, velocity, and acceleration',
          'Displacement and velocity are vector quantities (have direction)',
          'For constant acceleration, use the three kinematic equations',
          'Free fall acceleration g = 9.8 m/s² is the same for all objects',
          'Graphs provide visual understanding: slope of position-time = velocity, slope of velocity-time = acceleration',
          'Area under velocity-time graph = displacement',
          'Always check units and signs in your calculations'
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
          },
          {
            name: 'Average Velocity',
            formula: 'v_avg = Δx/Δt',
            description: 'Average velocity over a time interval'
          },
          {
            name: 'Average Acceleration',
            formula: 'a_avg = Δv/Δt',
            description: 'Average acceleration over a time interval'
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

    // Laws of Motion
    const lawsOfMotionContent: EducationalContent = {
      id: 'phy-mech-003-content',
      title: 'Laws of Motion',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Dynamics',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Newton's Laws of Motion

## Introduction
Newton's laws of motion are three fundamental principles that form the foundation of classical mechanics. They describe the relationship between forces acting on a body and its motion.

## Newton's First Law (Law of Inertia)

**Statement:** An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an external force.

### Key Points:
- Defines the concept of **inertia** - tendency to resist change in motion
- Introduces the concept of **inertial reference frames**
- Valid only in non-accelerating reference frames

### Mathematical Form:
If ΣF = 0, then v = constant (or a = 0)

### Examples:
- A book on a table remains at rest
- A hockey puck sliding on frictionless ice continues moving
- Passengers jerk forward when a car suddenly stops

## Newton's Second Law (Law of Acceleration)

**Statement:** The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

### Mathematical Form:
**F = ma** (most important equation in mechanics!)

Where:
- F = net force (N)
- m = mass (kg)  
- a = acceleration (m/s²)

### Important Notes:
- Force and acceleration are **vector quantities**
- Net force is the **vector sum** of all forces
- Mass is a **scalar quantity**
- Direction of acceleration is same as direction of net force

### Alternative Forms:
- F = dp/dt (force equals rate of change of momentum)
- F = ma only when mass is constant

## Newton's Third Law (Action-Reaction Law)

**Statement:** For every action, there is an equal and opposite reaction.

### Key Points:
- Forces always occur in **pairs**
- Action and reaction forces act on **different objects**
- They are equal in **magnitude** but opposite in **direction**
- They act **simultaneously**

### Mathematical Form:
F₁₂ = -F₂₁

### Examples:
- Walking: You push ground backward, ground pushes you forward
- Rocket propulsion: Gases pushed down, rocket pushed up
- Book on table: Book pushes table down, table pushes book up

## Types of Forces

### 1. Contact Forces
- **Normal Force (N)**: Perpendicular to surface
- **Friction Force (f)**: Opposes relative motion
- **Tension Force (T)**: Along strings/ropes
- **Applied Force (F)**: External push/pull

### 2. Non-Contact Forces
- **Gravitational Force (W = mg)**: Always downward
- **Electromagnetic Forces**: Between charged objects
- **Nuclear Forces**: Inside atoms

## Friction

### Static Friction
- Prevents motion when object is at rest
- f_s ≤ μ_s N (maximum static friction)
- Direction opposes tendency to move

### Kinetic Friction  
- Acts when object is moving
- f_k = μ_k N (kinetic friction)
- Direction opposes motion
- Usually μ_k < μ_s

## Problem-Solving Strategy

### 1. Draw Free Body Diagram (FBD)
- Identify the object of interest
- Draw all forces acting on the object
- Show forces as vectors from center of mass

### 2. Choose Coordinate System
- Usually align one axis with acceleration direction
- Resolve forces into components if needed

### 3. Apply Newton's Second Law
- ΣF_x = ma_x
- ΣF_y = ma_y
- Write separate equations for each direction

### 4. Solve the System
- Solve algebraically before substituting numbers
- Check units and reasonableness of answer

## Applications

### Inclined Plane Problems
- Resolve weight into components: mg sin θ and mg cos θ
- Normal force N = mg cos θ (for frictionless plane)
- Net force down plane = mg sin θ - f

### Pulley Systems
- Tension is same throughout massless string
- For massless pulley: forces on both sides equal
- Apply F = ma to each object separately

### Elevator Problems
- Apparent weight changes with acceleration
- If elevator accelerates up: N = mg + ma
- If elevator accelerates down: N = mg - ma
        `,
        examples: [
          {
            title: 'Block on Inclined Plane',
            problem: 'A 5 kg block slides down a frictionless inclined plane of angle 30°. Find the acceleration of the block and the normal force.',
            solution: `
**Given:**
- Mass (m) = 5 kg
- Angle (θ) = 30°
- Surface is frictionless
- g = 10 m/s²

**To find:** (a) Acceleration (a), (b) Normal force (N)

**Solution:**

**Step 1: Draw Free Body Diagram**
Forces acting on the block:
- Weight: W = mg = 5 × 10 = 50 N (vertically downward)
- Normal force: N (perpendicular to incline)

**Step 2: Resolve Weight into Components**
- Component parallel to incline: mg sin θ = 50 sin 30° = 25 N
- Component perpendicular to incline: mg cos θ = 50 cos 30° = 43.3 N

**Step 3: Apply Newton's Second Law**

*Along the incline (taking down the incline as positive):*
ΣF = ma
mg sin θ = ma
a = g sin θ = 10 × sin 30° = 10 × 0.5 = 5 m/s²

*Perpendicular to incline (no acceleration):*
ΣF = 0
N - mg cos θ = 0
N = mg cos θ = 43.3 N

**Answer:** (a) a = 5 m/s² down the incline, (b) N = 43.3 N
            `,
            explanation: 'Key insight: The acceleration depends only on the angle and is independent of mass for frictionless surfaces. This is why all objects slide down frictionless inclines with the same acceleration.'
          },
          {
            title: 'Atwood Machine',
            problem: 'Two masses m₁ = 3 kg and m₂ = 5 kg are connected by a light string over a frictionless pulley. Find the acceleration of the system and tension in the string.',
            solution: `
**Given:**
- m₁ = 3 kg, m₂ = 5 kg
- String is massless and inextensible
- Pulley is frictionless and massless
- g = 10 m/s²

**To find:** (a) Acceleration (a), (b) Tension (T)

**Solution:**

**Step 1: Analyze the Motion**
Since m₂ > m₁, mass m₂ will move downward and m₁ will move upward.
Both masses have the same magnitude of acceleration due to the string constraint.

**Step 2: Draw Free Body Diagrams**

*For m₁ (moving up):*
- Weight: m₁g = 30 N (downward)
- Tension: T (upward)

*For m₂ (moving down):*
- Weight: m₂g = 50 N (downward)  
- Tension: T (upward)

**Step 3: Apply Newton's Second Law**

*For m₁ (taking upward as positive):*
T - m₁g = m₁a
T - 30 = 3a ... (1)

*For m₂ (taking downward as positive):*
m₂g - T = m₂a
50 - T = 5a ... (2)

**Step 4: Solve the System**
Adding equations (1) and (2):
(T - 30) + (50 - T) = 3a + 5a
20 = 8a
a = 2.5 m/s²

Substituting in equation (1):
T = 30 + 3(2.5) = 37.5 N

**Verification:** Using equation (2):
T = 50 - 5(2.5) = 37.5 N ✓

**Answer:** (a) a = 2.5 m/s², (b) T = 37.5 N
            `,
            explanation: 'In Atwood machines, the heavier mass accelerates downward. The tension is always between the weights of the two masses. Notice how we used the constraint that both masses have the same acceleration magnitude.'
          }
        ],
        practiceQuestions: [
          {
            question: 'A force of 20 N acts on a 4 kg mass. What is the acceleration produced?',
            options: ['5 m/s²', '10 m/s²', '80 m/s²', '0.2 m/s²'],
            correctAnswer: 0,
            explanation: 'Using F = ma: a = F/m = 20/4 = 5 m/s²',
            difficulty: 'Easy'
          },
          {
            question: 'Which of Newton\'s laws explains why we feel pushed back into our seat when a car accelerates forward?',
            options: ['First Law', 'Second Law', 'Third Law', 'All three laws'],
            correctAnswer: 0,
            explanation: 'Newton\'s First Law (inertia) explains this. Our body tends to remain at rest while the car accelerates forward, making us feel pushed back.',
            difficulty: 'Medium'
          },
          {
            question: 'A 2 kg block on a frictionless incline of 45° has acceleration:',
            options: ['5 m/s²', '7.07 m/s²', '10 m/s²', '14.14 m/s²'],
            correctAnswer: 1,
            explanation: 'For frictionless incline: a = g sin θ = 10 × sin 45° = 10 × (1/√2) = 7.07 m/s²',
            difficulty: 'Medium'
          },
          {
            question: 'When you walk, the force that propels you forward is:',
            options: ['Force of your foot on ground', 'Force of ground on your foot', 'Your weight', 'Air resistance'],
            correctAnswer: 1,
            explanation: 'By Newton\'s Third Law, when you push the ground backward, the ground pushes you forward. This reaction force propels you.',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Newton\'s laws are valid only in inertial reference frames',
          'Force is a vector quantity - direction matters',
          'F = ma applies only when mass is constant',
          'Action-reaction pairs act on different objects',
          'Free body diagrams are essential for problem solving',
          'Net force determines acceleration, not individual forces',
          'Friction always opposes relative motion',
          'Normal force is not always equal to weight'
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
          },
          {
            name: 'Static Friction',
            formula: 'f_s ≤ μ_s N',
            description: 'Maximum static friction force'
          },
          {
            name: 'Kinetic Friction',
            formula: 'f_k = μ_k N',
            description: 'Kinetic friction force'
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

    // Work, Energy and Power
    const workEnergyContent: EducationalContent = {
      id: 'phy-mech-004-content',
      title: 'Work, Energy and Power',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Energy',
      difficulty: 'Intermediate',
      contentType: 'theory',
      content: {
        theory: `
# Work, Energy and Power

## Work

### Definition
Work is done when a force causes displacement of an object.

### Mathematical Definition
W = F⃗ · s⃗ = Fs cos θ

Where:
- W = work done (Joules)
- F = applied force (N)
- s = displacement (m)
- θ = angle between force and displacement

### Key Points about Work:
- Work is a scalar quantity
- Work can be positive, negative, or zero
- SI unit: Joule (J) = N⋅m
- Work is path-independent for conservative forces

### Cases:
1. **θ = 0°**: W = Fs (maximum positive work)
2. **θ = 90°**: W = 0 (no work done)
3. **θ = 180°**: W = -Fs (negative work)

## Energy

### Kinetic Energy (KE)
Energy possessed by an object due to its motion.

**Formula:** KE = ½mv²

### Potential Energy (PE)
Energy possessed by an object due to its position or configuration.

**Gravitational PE:** PE = mgh (near Earth's surface)
**Elastic PE:** PE = ½kx² (for springs)

### Mechanical Energy
Total mechanical energy = KE + PE = constant (for conservative systems)

## Work-Energy Theorem

**Statement:** The work done by all forces on an object equals the change in its kinetic energy.

**Mathematical Form:**
W_net = ΔKE = KE_final - KE_initial = ½mv² - ½mu²

### Applications:
- Solving problems without knowing acceleration or time
- Understanding energy transformations
- Analyzing complex motion

## Conservation of Energy

### For Conservative Forces:
Total mechanical energy remains constant.
KE₁ + PE₁ = KE₂ + PE₂

### For Non-Conservative Forces:
Energy is not conserved, but total energy (including heat, sound, etc.) is conserved.
W_non-conservative = ΔE_mechanical

## Power

### Definition
Power is the rate of doing work or rate of energy transfer.

### Mathematical Forms:
1. **P = W/t** (average power)
2. **P = F⃗ · v⃗ = Fv cos θ** (instantaneous power)

### Units:
- SI unit: Watt (W) = J/s
- Other units: horsepower (hp), kilowatt (kW)
- 1 hp = 746 W

## Conservative vs Non-Conservative Forces

### Conservative Forces:
- Work done is path-independent
- Work done in closed path = 0
- Examples: gravity, spring force, electrostatic force
- Associated with potential energy

### Non-Conservative Forces:
- Work done depends on path
- Examples: friction, air resistance, applied forces
- Energy is "lost" to heat, sound, etc.

## Problem-Solving Strategies

### Using Work-Energy Theorem:
1. Identify initial and final states
2. Calculate initial and final kinetic energies
3. Find work done by all forces
4. Apply: W_net = ΔKE

### Using Conservation of Energy:
1. Identify conservative system
2. Choose reference level for PE
3. Apply: E_initial = E_final
4. Solve for unknown quantity

### Using Power:
1. Identify force and velocity
2. Use P = Fv cos θ for instantaneous power
3. Use P = W/t for average power
        `,
        examples: [
          {
            title: 'Work-Energy Theorem Application',
            problem: 'A 2 kg block is pushed 5 m across a rough surface by a 20 N force at 37° to horizontal. If coefficient of friction μ = 0.3 and block starts from rest, find its final velocity.',
            solution: `
**Given:**
- m = 2 kg, s = 5 m, F = 20 N, θ = 37°
- μ = 0.3, u = 0 (starts from rest)
- g = 10 m/s²

**To find:** Final velocity (v)

**Solution using Work-Energy Theorem:**

**Step 1: Identify all forces and their work**

*Work by applied force:*
W₁ = Fs cos θ = 20 × 5 × cos 37° = 20 × 5 × 0.8 = 80 J

*Work by friction:*
First find normal force:
N = mg - F sin θ = 2 × 10 - 20 × sin 37°
N = 20 - 20 × 0.6 = 20 - 12 = 8 N

Friction force: f = μN = 0.3 × 8 = 2.4 N
Work by friction: W₂ = -fs = -2.4 × 5 = -12 J (negative because opposes motion)

*Work by weight and normal force:*
W₃ = 0 (perpendicular to displacement)

**Step 2: Apply Work-Energy Theorem**
W_net = ΔKE
W₁ + W₂ = ½mv² - ½mu²
80 + (-12) = ½ × 2 × v² - 0
68 = v²
v = √68 = 8.25 m/s

**Answer:** v = 8.25 m/s
            `,
            explanation: 'The work-energy theorem is powerful because it relates work directly to kinetic energy change, avoiding the need to find acceleration. Notice how friction does negative work.'
          },
          {
            title: 'Conservation of Energy',
            problem: 'A ball is thrown vertically upward with initial speed 20 m/s. Find the maximum height reached using energy conservation.',
            solution: `
**Given:**
- Initial velocity u = 20 m/s (upward)
- At maximum height, v = 0
- g = 10 m/s²

**To find:** Maximum height (h)

**Solution using Conservation of Energy:**

**Step 1: Choose reference level**
Take ground as reference level (PE = 0 at ground)

**Step 2: Identify initial and final states**

*Initial state (at ground):*
- KE₁ = ½mu² = ½m(20)² = 200m J
- PE₁ = 0 (reference level)
- Total energy E₁ = 200m J

*Final state (at maximum height):*
- KE₂ = ½mv² = 0 (v = 0 at max height)
- PE₂ = mgh
- Total energy E₂ = mgh J

**Step 3: Apply conservation of energy**
E₁ = E₂ (no non-conservative forces)
200m = mgh
200 = gh
h = 200/10 = 20 m

**Verification using kinematics:**
v² = u² - 2gh (taking upward as positive)
0 = (20)² - 2(10)h
h = 400/20 = 20 m ✓

**Answer:** h = 20 m
            `,
            explanation: 'Energy conservation provides an elegant solution without needing to consider time or acceleration. The initial kinetic energy is completely converted to potential energy at maximum height.'
          }
        ],
        practiceQuestions: [
          {
            question: 'A force of 10 N acts on a body at 60° to its displacement of 2 m. Work done is:',
            options: ['20 J', '10 J', '5 J', '0 J'],
            correctAnswer: 1,
            explanation: 'W = Fs cos θ = 10 × 2 × cos 60° = 10 × 2 × 0.5 = 10 J',
            difficulty: 'Easy'
          },
          {
            question: 'A 1 kg ball falls from height 5 m. Its kinetic energy just before hitting ground is:',
            options: ['5 J', '25 J', '50 J', '10 J'],
            correctAnswer: 2,
            explanation: 'Using conservation of energy: PE = KE, so mgh = ½mv². KE = mgh = 1 × 10 × 5 = 50 J',
            difficulty: 'Medium'
          },
          {
            question: 'Power required to lift 100 kg mass through 10 m in 5 s is:',
            options: ['200 W', '1000 W', '2000 W', '500 W'],
            correctAnswer: 2,
            explanation: 'Work = mgh = 100 × 10 × 10 = 10,000 J. Power = W/t = 10,000/5 = 2000 W',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Work is force times displacement times cosine of angle between them',
          'Work-energy theorem: W_net = ΔKE',
          'Energy is conserved in absence of non-conservative forces',
          'Power is rate of doing work: P = W/t = Fv',
          'Conservative forces are path-independent',
          'Potential energy depends on reference level chosen',
          'Kinetic energy is always positive',
          'Work can be positive, negative, or zero'
        ],
        formulas: [
          {
            name: 'Work Done',
            formula: 'W = Fs cos θ',
            description: 'Work done by constant force'
          },
          {
            name: 'Kinetic Energy',
            formula: 'KE = ½mv²',
            description: 'Energy due to motion'
          },
          {
            name: 'Gravitational Potential Energy',
            formula: 'PE = mgh',
            description: 'Energy due to height above reference'
          },
          {
            name: 'Work-Energy Theorem',
            formula: 'W_net = ΔKE',
            description: 'Net work equals change in kinetic energy'
          },
          {
            name: 'Power',
            formula: 'P = W/t = Fv cos θ',
            description: 'Rate of doing work'
          }
        ]
      },
      estimatedReadTime: 35,
      prerequisites: ['phy-mech-001', 'phy-mech-003'],
      nextTopics: ['phy-mech-005'],
      examRelevance: {
        jeeMain: 14,
        jeeAdvanced: 16,
        neet: 12
      },
      lastUpdated: new Date()
    };

    this.contentDatabase.set('phy-mech-001', kinematicsContent);
    this.contentDatabase.set('phy-mech-003', lawsOfMotionContent);
    this.contentDatabase.set('phy-mech-004', workEnergyContent);
  }

  private addChemistryContent(): void {
    const atomicStructureContent: EducationalContent = {
      id: 'chem-phys-001-content',
      title: 'Structure of Atom',
      subject: 'Chemistry',
      topic: 'Physical Chemistry',
      subtopic: 'Atomic Structure',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Structure of Atom

## Historical Development

### Dalton's Atomic Theory (1808)
1. Matter consists of indivisible atoms
2. All atoms of an element are identical
3. Compounds form by combination of atoms in simple ratios
4. Atoms are neither created nor destroyed in chemical reactions

**Limitations:** Could not explain electrical nature of matter

### Thomson's Model (1897)
- Discovery of electron (cathode ray experiments)
- "Plum pudding" model: positive sphere with embedded electrons
- Atom is electrically neutral overall

**Limitations:** Could not explain scattering of α-particles

### Rutherford's Model (1911)
- Nuclear model based on α-particle scattering experiment
- Dense, positively charged nucleus at center
- Electrons revolve around nucleus in circular orbits

**Limitations:** Could not explain stability of atom and atomic spectra

### Bohr's Model (1913)
- Electrons move in fixed circular orbits (stationary states)
- Energy is quantized: E = -13.6/n² eV (for hydrogen)
- Electron can jump between orbits by absorbing/emitting energy

**Limitations:** Could not explain spectra of multi-electron atoms

## Modern Atomic Theory

### Wave-Particle Duality
- **de Broglie equation:** λ = h/mv
- Electrons exhibit both wave and particle properties
- **Heisenberg Uncertainty Principle:** Δx·Δp ≥ h/4π

### Quantum Mechanical Model
- Electrons exist in orbitals (probability regions)
- Described by wave functions (ψ)
- |ψ|² gives probability density

## Quantum Numbers

### 1. Principal Quantum Number (n)
- **Values:** 1, 2, 3, 4, ... (positive integers)
- **Significance:** 
  - Determines energy level and size of orbital
  - Distance from nucleus
  - Maximum electrons in shell = 2n²

### 2. Azimuthal Quantum Number (l)
- **Values:** 0 to (n-1)
- **Significance:**
  - Determines shape of orbital
  - Subshell designation: s(l=0), p(l=1), d(l=2), f(l=3)
  - Maximum electrons in subshell = 2(2l+1)

### 3. Magnetic Quantum Number (m or mₗ)
- **Values:** -l to +l (including 0)
- **Significance:**
  - Determines orientation of orbital in space
  - Number of orbitals in subshell = 2l+1

### 4. Spin Quantum Number (s or mₛ)
- **Values:** +½ or -½
- **Significance:**
  - Intrinsic angular momentum of electron
  - Determines spin direction (clockwise or anticlockwise)

## Electronic Configuration

### Aufbau Principle
Electrons fill orbitals in order of increasing energy:
1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < 5p < 6s < 4f < 5d < 6p...

### Pauli Exclusion Principle
No two electrons in an atom can have identical set of four quantum numbers.
**Consequence:** Maximum 2 electrons per orbital with opposite spins.

### Hund's Rule
Electrons singly occupy orbitals of equal energy before pairing up.
**Reason:** Minimizes electron-electron repulsion.

### Electronic Configuration Examples:
- **H (Z=1):** 1s¹
- **He (Z=2):** 1s²
- **Li (Z=3):** 1s² 2s¹
- **C (Z=6):** 1s² 2s² 2p²
- **Ne (Z=10):** 1s² 2s² 2p⁶
- **Na (Z=11):** 1s² 2s² 2p⁶ 3s¹

### Anomalous Configurations:
- **Cr (Z=24):** [Ar] 4s¹ 3d⁵ (not 4s² 3d⁴)
- **Cu (Z=29):** [Ar] 4s¹ 3d¹⁰ (not 4s² 3d⁹)

**Reason:** Extra stability of half-filled and completely filled subshells.

## Atomic Orbitals

### s-Orbitals
- **Shape:** Spherical
- **Number:** 1 per shell (starting from n=1)
- **Electrons:** Maximum 2

### p-Orbitals
- **Shape:** Dumbbell
- **Number:** 3 per shell (starting from n=2)
- **Orientation:** px, py, pz
- **Electrons:** Maximum 6

### d-Orbitals
- **Shape:** Complex (cloverleaf, etc.)
- **Number:** 5 per shell (starting from n=3)
- **Electrons:** Maximum 10

### f-Orbitals
- **Shape:** Very complex
- **Number:** 7 per shell (starting from n=4)
- **Electrons:** Maximum 14

## Periodic Trends

### Atomic Radius
- **Across period:** Decreases (increasing nuclear charge)
- **Down group:** Increases (additional electron shells)

### Ionization Energy
- **Definition:** Energy required to remove electron from gaseous atom
- **Across period:** Increases (stronger nuclear attraction)
- **Down group:** Decreases (electrons farther from nucleus)

### Electron Affinity
- **Definition:** Energy released when electron is added to gaseous atom
- **Trend:** Generally increases across period, varies down group

### Electronegativity
- **Definition:** Tendency to attract electrons in chemical bond
- **Across period:** Increases
- **Down group:** Decreases
        `,
        examples: [
          {
            title: 'Electronic Configuration',
            problem: 'Write the electronic configuration of Chromium (Z = 24) and explain the anomaly.',
            solution: `
**Expected configuration based on Aufbau principle:**
1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁴

**Actual configuration:**
1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d⁵

**Explanation of anomaly:**
1. **Half-filled stability:** The d⁵ configuration is more stable than d⁴
2. **Exchange energy:** Electrons in half-filled subshell have parallel spins, leading to exchange energy stabilization
3. **Energy difference:** The 4s and 3d orbitals are very close in energy, making electron promotion favorable

**Similar anomaly in Copper (Z = 29):**
- Expected: [Ar] 4s² 3d⁹
- Actual: [Ar] 4s¹ 3d¹⁰ (completely filled d subshell)

**Key point:** Half-filled (d⁵, f⁷) and completely filled (d¹⁰, f¹⁴) subshells provide extra stability.
            `,
            explanation: 'Electronic configuration anomalies occur due to the extra stability associated with half-filled and completely filled subshells. This is important for understanding chemical properties of transition elements.'
          },
          {
            title: 'Quantum Numbers',
            problem: 'For the electron in 3p orbital, write all possible sets of quantum numbers.',
            solution: `
**For 3p orbital:**
- n = 3 (third shell)
- l = 1 (p subshell)
- m = -1, 0, +1 (three p orbitals: px, py, pz)
- s = +½ or -½ (spin up or down)

**All possible sets of quantum numbers:**

| n | l | m | s |
|---|---|---|---|
| 3 | 1 | -1 | +½ |
| 3 | 1 | -1 | -½ |
| 3 | 1 | 0 | +½ |
| 3 | 1 | 0 | -½ |
| 3 | 1 | +1 | +½ |
| 3 | 1 | +1 | -½ |

**Total possible electrons in 3p:** 6 electrons (2 per orbital × 3 orbitals)

**Note:** Each set of four quantum numbers uniquely identifies an electron in the atom (Pauli Exclusion Principle).
            `,
            explanation: 'Understanding quantum numbers is crucial for determining electron arrangements and predicting chemical behavior. Each electron has a unique set of four quantum numbers.'
          }
        ],
        practiceQuestions: [
          {
            question: 'Which of the following has the maximum number of unpaired electrons?',
            options: ['N (Z=7)', 'O (Z=8)', 'F (Z=9)', 'Ne (Z=10)'],
            correctAnswer: 0,
            explanation: 'N: 1s² 2s² 2p³. The 2p³ configuration has 3 unpaired electrons (following Hund\'s rule). O has 2, F has 1, and Ne has 0 unpaired electrons.',
            difficulty: 'Medium'
          },
          {
            question: 'The electronic configuration of Cr³⁺ ion is:',
            options: ['[Ar] 4s¹ 3d²', '[Ar] 3d³', '[Ar] 4s² 3d¹', '[Ar] 3d⁵'],
            correctAnswer: 1,
            explanation: 'Cr: [Ar] 4s¹ 3d⁵. For Cr³⁺, remove 3 electrons (1 from 4s and 2 from 3d): [Ar] 3d³',
            difficulty: 'Medium'
          },
          {
            question: 'Maximum number of electrons in M shell is:',
            options: ['8', '18', '32', '50'],
            correctAnswer: 1,
            explanation: 'M shell corresponds to n=3. Maximum electrons = 2n² = 2(3)² = 18',
            difficulty: 'Easy'
          }
        ],
        keyPoints: [
          'Quantum numbers completely describe an electron in an atom',
          'Electronic configuration determines chemical properties',
          'Stability of half-filled and filled subshells causes anomalies',
          'Pauli exclusion principle limits electrons per orbital to 2',
          'Hund\'s rule minimizes electron-electron repulsion',
          'Aufbau principle gives order of orbital filling',
          'Atomic properties show periodic trends',
          'Wave-particle duality led to quantum mechanical model'
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
          },
          {
            name: 'de Broglie wavelength',
            formula: 'λ = h/mv',
            description: 'Wavelength associated with moving particle'
          },
          {
            name: 'Bohr energy levels',
            formula: 'E = -13.6/n² eV',
            description: 'Energy of electron in nth orbit of hydrogen'
          }
        ]
      },
      estimatedReadTime: 40,
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

### Intuitive Understanding
Consider f(x) = (x² - 1)/(x - 1) for x ≠ 1.
As x gets closer to 1, what happens to f(x)?

Let's check some values:
- f(0.9) = (0.81 - 1)/(0.9 - 1) = -0.19/(-0.1) = 1.9
- f(0.99) = (0.9801 - 1)/(0.99 - 1) = -0.0199/(-0.01) = 1.99
- f(1.01) = (1.0201 - 1)/(1.01 - 1) = 0.0201/0.01 = 2.01
- f(1.1) = (1.21 - 1)/(1.1 - 1) = 0.21/0.1 = 2.1

As x approaches 1, f(x) approaches 2.

## Formal Definition of Limit

**Definition:** lim(x→a) f(x) = L means that f(x) can be made arbitrarily close to L by taking x sufficiently close to a (but x ≠ a).

**Mathematical notation:** For any ε > 0, there exists δ > 0 such that if 0 < |x - a| < δ, then |f(x) - L| < ε.

## Types of Limits

### 1. Finite Limits
When lim(x→a) f(x) = L, where L is a finite number.

### 2. Infinite Limits
- lim(x→a) f(x) = +∞
- lim(x→a) f(x) = -∞

### 3. Limits at Infinity
- lim(x→+∞) f(x) = L
- lim(x→-∞) f(x) = L

### 4. One-sided Limits
- **Right-hand limit:** lim(x→a⁺) f(x)
- **Left-hand limit:** lim(x→a⁻) f(x)

**Important:** lim(x→a) f(x) exists if and only if both one-sided limits exist and are equal.

## Standard Limits

### Fundamental Limits
1. **lim(x→0) (sin x)/x = 1**
2. **lim(x→0) (1 - cos x)/x = 0**
3. **lim(x→0) (eˣ - 1)/x = 1**
4. **lim(x→0) (ln(1 + x))/x = 1**
5. **lim(x→0) (aˣ - 1)/x = ln a**
6. **lim(x→∞) (1 + 1/x)ˣ = e**
7. **lim(x→0) (1 + x)^(1/x) = e**

### Polynomial and Rational Functions
- lim(x→a) P(x) = P(a) for any polynomial P(x)
- lim(x→a) P(x)/Q(x) = P(a)/Q(a) if Q(a) ≠ 0

## Methods of Evaluation

### 1. Direct Substitution
If f(x) is continuous at x = a, then lim(x→a) f(x) = f(a).

**Example:** lim(x→2) (x² + 3x - 1) = 4 + 6 - 1 = 9

### 2. Factorization (for 0/0 forms)
Factor numerator and denominator, then cancel common factors.

**Example:** 
lim(x→2) (x² - 4)/(x - 2) = lim(x→2) (x + 2)(x - 2)/(x - 2) = lim(x→2) (x + 2) = 4

### 3. Rationalization
Multiply by conjugate to eliminate radicals.

**Example:**
lim(x→0) (√(1 + x) - 1)/x = lim(x→0) [(√(1 + x) - 1)(√(1 + x) + 1)]/[x(√(1 + x) + 1)]
= lim(x→0) x/[x(√(1 + x) + 1)] = lim(x→0) 1/(√(1 + x) + 1) = 1/2

### 4. L'Hôpital's Rule
For 0/0 or ∞/∞ forms:
lim(x→a) f(x)/g(x) = lim(x→a) f'(x)/g'(x)

**Conditions:**
- f(a) = g(a) = 0 or f(a) = g(a) = ±∞
- f'(x) and g'(x) exist near x = a
- lim(x→a) f'(x)/g'(x) exists

### 5. Standard Substitutions
Use trigonometric, exponential, or logarithmic substitutions.

## Indeterminate Forms

### Seven Indeterminate Forms:
1. **0/0**
2. **∞/∞**
3. **0 × ∞**
4. **∞ - ∞**
5. **0⁰**
6. **1^∞**
7. **∞⁰**

### Techniques for Each Form:
- **0/0, ∞/∞:** L'Hôpital's rule, factorization, rationalization
- **0 × ∞:** Rewrite as 0/0 or ∞/∞
- **∞ - ∞:** Factor or rationalize
- **0⁰, 1^∞, ∞⁰:** Use logarithms: if y = f(x)^g(x), then ln y = g(x) ln f(x)

## Continuity

### Definition
A function f(x) is continuous at x = a if:
1. **f(a) is defined**
2. **lim(x→a) f(x) exists**
3. **lim(x→a) f(x) = f(a)**

### Types of Discontinuity

#### 1. Removable Discontinuity
- Limit exists but ≠ f(a) or f(a) is undefined
- Can be "removed" by redefining f(a)

#### 2. Jump Discontinuity
- Left and right limits exist but are unequal
- Function "jumps" from one value to another

#### 3. Infinite Discontinuity
- Function approaches ±∞ at the point
- Vertical asymptote exists

### Properties of Continuous Functions

1. **Algebra of Continuous Functions:**
   - Sum, difference, product of continuous functions is continuous
   - Quotient is continuous where denominator ≠ 0

2. **Composition:** If f is continuous at a and g is continuous at f(a), then g∘f is continuous at a

3. **Intermediate Value Theorem:** If f is continuous on [a,b] and k is between f(a) and f(b), then there exists c ∈ (a,b) such that f(c) = k

4. **Extreme Value Theorem:** If f is continuous on [a,b], then f attains its maximum and minimum values

## Problem-Solving Strategy

### Step-by-Step Approach:
1. **Try direct substitution first**
2. **If you get a definite value, that's your answer**
3. **If you get an indeterminate form, identify the type**
4. **Choose appropriate method based on the form**
5. **Apply the method carefully**
6. **Verify your answer if possible**

### Common Mistakes to Avoid:
- Applying L'Hôpital's rule when not applicable
- Algebraic errors in factorization
- Forgetting to check if limit exists
- Confusing one-sided limits with two-sided limits
        `,
        examples: [
          {
            title: 'Evaluating 0/0 Form using Factorization',
            problem: 'Evaluate lim(x→3) (x² - 9)/(x² - 6x + 9)',
            solution: `
**Step 1: Direct substitution**
Substituting x = 3:
Numerator: 3² - 9 = 9 - 9 = 0
Denominator: 3² - 6(3) + 9 = 9 - 18 + 9 = 0

We get 0/0 form, so we need to use algebraic manipulation.

**Step 2: Factor numerator and denominator**
Numerator: x² - 9 = (x + 3)(x - 3)
Denominator: x² - 6x + 9 = (x - 3)²

**Step 3: Simplify**
lim(x→3) (x² - 9)/(x² - 6x + 9) = lim(x→3) [(x + 3)(x - 3)]/[(x - 3)²]
= lim(x→3) (x + 3)/(x - 3)

**Step 4: Evaluate the simplified limit**
As x → 3, numerator → 3 + 3 = 6
As x → 3, denominator → 3 - 3 = 0

Since numerator approaches 6 (≠ 0) and denominator approaches 0:
lim(x→3) (x + 3)/(x - 3) = ∞ (limit does not exist)

**Answer:** The limit does not exist (approaches ∞)
            `,
            explanation: 'After factoring and canceling, we still get a form where the denominator approaches 0 while numerator approaches a non-zero value, indicating the limit is infinite.'
          },
          {
            title: 'Using L\'Hôpital\'s Rule',
            problem: 'Evaluate lim(x→0) (sin 3x)/(sin 5x)',
            solution: `
**Step 1: Check if L'Hôpital's rule applies**
As x → 0:
- sin 3x → sin 0 = 0
- sin 5x → sin 0 = 0

We have 0/0 form, so L'Hôpital's rule can be applied.

**Step 2: Apply L'Hôpital's rule**
lim(x→0) (sin 3x)/(sin 5x) = lim(x→0) [d/dx(sin 3x)]/[d/dx(sin 5x)]
= lim(x→0) (3 cos 3x)/(5 cos 5x)

**Step 3: Evaluate the new limit**
As x → 0:
- 3 cos 3x → 3 cos 0 = 3(1) = 3
- 5 cos 5x → 5 cos 0 = 5(1) = 5

Therefore: lim(x→0) (3 cos 3x)/(5 cos 5x) = 3/5

**Alternative Method using Standard Limits:**
lim(x→0) (sin 3x)/(sin 5x) = lim(x→0) [(sin 3x)/(3x)] × [(5x)/(sin 5x)] × (3x)/(5x)
= lim(x→0) [(sin 3x)/(3x)] × [1/(sin 5x)/(5x)] × (3/5)
= 1 × (1/1) × (3/5) = 3/5

**Answer:** 3/5
            `,
            explanation: 'Both L\'Hôpital\'s rule and the standard limit method give the same answer. The standard limit approach often provides more insight into the structure of the problem.'
          },
          {
            title: 'Limit involving e',
            problem: 'Evaluate lim(x→∞) (1 + 2/x)^x',
            solution: `
**Step 1: Recognize the form**
This is of the form 1^∞, which is indeterminate.

**Step 2: Use logarithms**
Let y = (1 + 2/x)^x
Then ln y = x ln(1 + 2/x)

We need to find lim(x→∞) x ln(1 + 2/x)

**Step 3: Rewrite to apply standard limit**
lim(x→∞) x ln(1 + 2/x) = lim(x→∞) [ln(1 + 2/x)]/(1/x)

As x → ∞, this becomes 0/0 form.

**Step 4: Apply L'Hôpital's rule**
lim(x→∞) [ln(1 + 2/x)]/(1/x) = lim(x→∞) [d/dx ln(1 + 2/x)]/[d/dx (1/x)]
= lim(x→∞) [1/(1 + 2/x) × (-2/x²)]/[-1/x²]
= lim(x→∞) [2/(1 + 2/x)]
= 2/(1 + 0) = 2

**Step 5: Find the original limit**
Since lim(x→∞) ln y = 2, we have:
lim(x→∞) y = e²

**Alternative Method:**
lim(x→∞) (1 + 2/x)^x = lim(x→∞) [(1 + 2/x)^(x/2)]²
= [lim(x→∞) (1 + 2/x)^(x/2)]²
= [e]² = e²

**Answer:** e²
            `,
            explanation: 'For limits of the form (1 + a/x)^x as x→∞, the result is e^a. This is a generalization of the fundamental limit defining e.'
          }
        ],
        practiceQuestions: [
          {
            question: 'What is lim(x→0) (sin 5x)/(sin 3x)?',
            options: ['5/3', '3/5', '1', '0'],
            correctAnswer: 0,
            explanation: 'Using the standard limit property: lim(x→0) (sin ax)/(sin bx) = a/b, we get 5/3.',
            difficulty: 'Medium'
          },
          {
            question: 'lim(x→2) (x³ - 8)/(x - 2) equals:',
            options: ['0', '4', '8', '12'],
            correctAnswer: 3,
            explanation: 'Factor: x³ - 8 = (x-2)(x² + 2x + 4). After canceling (x-2): lim(x→2) (x² + 2x + 4) = 4 + 4 + 4 = 12.',
            difficulty: 'Medium'
          },
          {
            question: 'If f(x) = (x² - 1)/(x - 1) for x ≠ 1 and f(1) = 3, then f is:',
            options: ['Continuous at x = 1', 'Discontinuous at x = 1', 'Not defined at x = 1', 'None of these'],
            correctAnswer: 1,
            explanation: 'lim(x→1) f(x) = lim(x→1) (x+1) = 2, but f(1) = 3. Since limit ≠ function value, f is discontinuous at x = 1.',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Limits describe function behavior near a point, not at the point',
          'Direct substitution works for continuous functions',
          'Standard limits are essential tools for evaluation',
          'L\'Hôpital\'s rule applies only to 0/0 and ∞/∞ forms',
          'Factorization and rationalization are key algebraic techniques',
          'Continuity requires limit to exist and equal function value',
          'One-sided limits must be equal for two-sided limit to exist',
          'Indeterminate forms require special techniques'
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
          },
          {
            name: 'Exponential Limit',
            formula: 'lim(x→0) (e^x - 1)/x = 1',
            description: 'Standard exponential limit'
          },
          {
            name: 'Definition of e',
            formula: 'lim(x→∞) (1 + 1/x)^x = e',
            description: 'Fundamental limit defining e'
          }
        ]
      },
      estimatedReadTime: 45,
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
      title: 'Cell: The Unit of Life',
      subject: 'Biology',
      topic: 'Cell Biology',
      subtopic: 'Cell Structure',
      difficulty: 'Foundation',
      contentType: 'theory',
      content: {
        theory: `
# Cell: The Unit of Life

## Introduction

The cell is the basic structural and functional unit of life. All living organisms are composed of one or more cells, making cell biology fundamental to understanding life processes.

## Cell Theory

### Historical Development
1. **Robert Hooke (1665):** First observed cells in cork tissue
2. **Anton van Leeuwenhoek (1674):** First observed living cells
3. **Matthias Schleiden (1838):** All plants are made of cells
4. **Theodor Schwann (1839):** All animals are made of cells
5. **Rudolf Virchow (1855):** "Omnis cellula e cellula" (all cells from cells)

### Modern Cell Theory
1. **All living things are composed of one or more cells**
2. **The cell is the basic unit of life**
3. **All cells arise from pre-existing cells**

## Types of Cells

### Prokaryotic Cells
- **No membrane-bound nucleus**
- Genetic material freely distributed in cytoplasm
- Examples: Bacteria, Archaea

#### Characteristics:
- Simple internal structure
- Cell wall present (peptidoglycan in bacteria)
- Ribosomes (70S type)
- No membrane-bound organelles
- Nucleoid region contains DNA
- Size: 1-5 μm

#### Bacterial Cell Structure:
- **Cell wall:** Protection and shape
- **Cell membrane:** Selective permeability
- **Cytoplasm:** Site of metabolic activities
- **Nucleoid:** Contains genetic material
- **Ribosomes:** Protein synthesis
- **Flagella:** Movement (in some bacteria)
- **Pili:** Attachment and conjugation

### Eukaryotic Cells
- **Membrane-bound nucleus**
- Genetic material enclosed in nucleus
- Examples: Plants, Animals, Fungi, Protists

#### Characteristics:
- Complex internal structure
- Membrane-bound organelles
- Ribosomes (80S type)
- Compartmentalization
- Size: 10-100 μm

## Eukaryotic Cell Organelles

### 1. Nucleus
- **Function:** Control center of cell, contains DNA
- **Structure:** 
  - Nuclear envelope (double membrane)
  - Nuclear pores (transport)
  - Nucleoplasm (nuclear matrix)
  - Nucleolus (ribosome synthesis)
- **Importance:** Gene expression, DNA replication

### 2. Mitochondria
- **Function:** Powerhouse of cell, ATP production
- **Structure:** 
  - Double membrane
  - Outer membrane (smooth)
  - Inner membrane (cristae for surface area)
  - Matrix (contains enzymes, DNA, ribosomes)
- **Importance:** Cellular respiration, energy metabolism
- **Origin:** Endosymbiotic theory

### 3. Endoplasmic Reticulum (ER)

#### Rough ER (RER):
- **Structure:** Ribosomes attached to surface
- **Function:** 
  - Protein synthesis
  - Protein modification and folding
  - Transport of proteins

#### Smooth ER (SER):
- **Structure:** No ribosomes
- **Function:**
  - Lipid synthesis
  - Steroid hormone production
  - Detoxification
  - Calcium storage

### 4. Golgi Apparatus
- **Function:** Processing, packaging, shipping center
- **Structure:** 
  - Stacks of flattened membranes (cisternae)
  - Cis face (receiving side)
  - Trans face (shipping side)
- **Importance:** 
  - Protein modification (glycosylation)
  - Secretion
  - Lysosome formation

### 5. Ribosomes
- **Function:** Protein synthesis
- **Types:** 
  - Free ribosomes (cytoplasmic proteins)
  - Bound ribosomes (secretory proteins)
- **Structure:** Large and small subunits
- **Composition:** rRNA + proteins

### 6. Lysosomes
- **Function:** Digestive organelles ("suicide bags")
- **Contents:** Hydrolytic enzymes (acid hydrolases)
- **Importance:** 
  - Waste disposal
  - Autophagy (self-digestion)
  - Apoptosis
  - Digestion of worn-out organelles

### 7. Vacuoles

#### Plant Cells:
- **Large central vacuole**
- **Functions:**
  - Maintains turgor pressure
  - Storage of water and substances
  - Structural support
  - Waste disposal

#### Animal Cells:
- **Small, temporary vacuoles**
- **Types:**
  - Food vacuoles
  - Contractile vacuoles (in protists)

### 8. Chloroplasts (Plant Cells Only)
- **Function:** Photosynthesis
- **Structure:**
  - Double membrane
  - Thylakoids (contain chlorophyll)
  - Grana (stacks of thylakoids)
  - Stroma (fluid matrix)
- **Importance:** Light energy conversion to chemical energy
- **Origin:** Endosymbiotic theory

### 9. Peroxisomes
- **Function:** Detoxification, fatty acid oxidation
- **Enzymes:** Catalase, oxidases
- **Importance:** 
  - H₂O₂ breakdown
  - Lipid metabolism
  - Photorespiration (in plants)

## Cell Membrane Structure

### Fluid Mosaic Model (Singer-Nicolson, 1972)
- **Phospholipid bilayer:** Basic structure
- **Embedded proteins:** Integral and peripheral
- **Cholesterol molecules:** Membrane fluidity
- **Carbohydrate chains:** Cell recognition

### Components:
1. **Phospholipids:** Hydrophilic head, hydrophobic tails
2. **Proteins:** Transport, enzymes, receptors
3. **Cholesterol:** Fluidity regulation
4. **Carbohydrates:** Recognition, signaling

### Functions:
1. **Selective permeability**
2. **Cell recognition**
3. **Signal transduction**
4. **Transport of materials**
5. **Maintaining cell shape**

## Transport Across Cell Membrane

### Passive Transport (No energy required)

#### 1. Simple Diffusion
- Movement along concentration gradient
- Small, nonpolar molecules (O₂, CO₂)
- Through lipid bilayer

#### 2. Facilitated Diffusion
- Through protein channels or carriers
- Polar molecules, ions
- Still along concentration gradient

#### 3. Osmosis
- Water movement through semipermeable membrane
- From low to high solute concentration
- Important for cell volume regulation

### Active Transport (Energy required)

#### 1. Primary Active Transport
- Direct use of ATP
- Against concentration gradient
- Example: Sodium-potassium pump

#### 2. Secondary Active Transport
- Indirect use of ATP
- Uses electrochemical gradient
- Cotransport (symport/antiport)

#### 3. Bulk Transport
- **Endocytosis:** Taking in large molecules
  - Phagocytosis (cell eating)
  - Pinocytosis (cell drinking)
  - Receptor-mediated endocytosis
- **Exocytosis:** Secretion of materials

## Cell Wall (Plant Cells)

### Composition:
- **Primary wall:** Cellulose, hemicellulose, pectin
- **Secondary wall:** More cellulose, lignin
- **Middle lamella:** Pectin (between adjacent cells)

### Functions:
1. **Structural support**
2. **Protection**
3. **Shape maintenance**
4. **Prevents over-expansion**
5. **Cell-to-cell communication (plasmodesmata)**

## Cytoskeleton

### Components:
1. **Microfilaments (Actin filaments)**
   - Thinnest (7 nm)
   - Cell shape, muscle contraction

2. **Microtubules**
   - Thickest (25 nm)
   - Cell shape, organelle movement
   - Cilia and flagella structure

3. **Intermediate filaments**
   - Medium size (10 nm)
   - Structural support

### Functions:
- **Cell shape maintenance**
- **Organelle movement**
- **Cell division**
- **Muscle contraction**
- **Cellular locomotion**

## Differences Between Plant and Animal Cells

| Feature | Plant Cell | Animal Cell |
|---------|------------|-------------|
| Cell wall | Present | Absent |
| Chloroplasts | Present | Absent |
| Large vacuole | Present | Absent |
| Centrioles | Absent | Present |
| Shape | Fixed (due to cell wall) | Variable |
| Lysosomes | Rare | Common |
| Storage | Starch | Glycogen |
        `,
        examples: [
          {
            title: 'Osmosis in Plant and Animal Cells',
            problem: 'Explain what happens when plant and animal cells are placed in hypotonic, isotonic, and hypertonic solutions.',
            solution: `
**Hypotonic Solution (Lower solute concentration outside):**

*Plant Cell:*
- Water enters the cell by osmosis
- Cell swells and becomes turgid
- Cell wall prevents bursting
- Turgor pressure develops
- Cell becomes firm and rigid

*Animal Cell:*
- Water enters the cell
- Cell swells and may burst (lysis)
- No cell wall to provide protection
- Cell membrane may rupture

**Isotonic Solution (Equal solute concentration):**

*Both Plant and Animal Cells:*
- No net water movement
- Cell maintains normal size
- Dynamic equilibrium
- Optimal condition for most cells

**Hypertonic Solution (Higher solute concentration outside):**

*Plant Cell:*
- Water leaves the cell
- Cell membrane pulls away from cell wall
- Plasmolysis occurs
- Cell becomes flaccid
- Plant wilts

*Animal Cell:*
- Water leaves the cell
- Cell shrinks and becomes crenated
- Cell membrane wrinkles
- Cell function may be impaired

**Key Differences:**
1. Plant cells have cell wall protection
2. Animal cells are more vulnerable to osmotic changes
3. Turgor pressure is crucial for plant structure
4. Animal cells need isotonic environment
            `,
            explanation: 'The presence of a cell wall in plants provides protection against osmotic pressure, while animal cells rely on maintaining isotonic conditions. This explains why plants can survive in varying water conditions better than animal cells.'
          },
          {
            title: 'Endosymbiotic Theory',
            problem: 'Explain the endosymbiotic theory and provide evidence supporting the origin of mitochondria and chloroplasts.',
            solution: `
**Endosymbiotic Theory:**
Proposed by Lynn Margulis, this theory suggests that mitochondria and chloroplasts were once free-living prokaryotic organisms that were engulfed by early eukaryotic cells, leading to a mutually beneficial relationship.

**Evidence for Mitochondria:**

1. **Size and Shape:**
   - Similar to bacteria (1-5 μm)
   - Rod-shaped like many bacteria

2. **DNA:**
   - Circular DNA (like bacteria)
   - Not associated with histones
   - Genes similar to α-proteobacteria

3. **Ribosomes:**
   - 70S ribosomes (like prokaryotes)
   - Different from eukaryotic 80S ribosomes

4. **Reproduction:**
   - Binary fission (like bacteria)
   - Independent of cell division

5. **Membranes:**
   - Double membrane structure
   - Inner membrane similar to bacterial membrane

**Evidence for Chloroplasts:**

1. **Similar to Cyanobacteria:**
   - Size, shape, and pigments
   - Photosynthetic machinery

2. **DNA and Ribosomes:**
   - Circular DNA
   - 70S ribosomes
   - Genes similar to cyanobacteria

3. **Reproduction:**
   - Binary fission
   - Independent replication

**Evolutionary Significance:**
- Explains the origin of eukaryotic cells
- Accounts for the complexity of eukaryotes
- Demonstrates the importance of symbiosis in evolution
- Explains why these organelles have their own genetic material

**Modern Evidence:**
- Phylogenetic analysis confirms bacterial origin
- Some modern organisms show similar symbiotic relationships
- Molecular studies support the theory
            `,
            explanation: 'The endosymbiotic theory explains one of the most important evolutionary transitions - the origin of complex eukaryotic cells. The evidence strongly supports that mitochondria and chloroplasts were once independent bacteria.'
          }
        ],
        practiceQuestions: [
          {
            question: 'Which organelle is known as the "powerhouse of the cell"?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
            correctAnswer: 1,
            explanation: 'Mitochondria are called the powerhouse because they produce ATP through cellular respiration, providing energy for cellular processes.',
            difficulty: 'Easy'
          },
          {
            question: 'The fluid mosaic model describes the structure of:',
            options: ['Cell wall', 'Cell membrane', 'Nucleus', 'Cytoplasm'],
            correctAnswer: 1,
            explanation: 'The fluid mosaic model explains the structure of cell membrane with phospholipid bilayer and embedded proteins that can move laterally.',
            difficulty: 'Medium'
          },
          {
            question: 'Which of the following is found only in plant cells?',
            options: ['Mitochondria', 'Ribosomes', 'Chloroplasts', 'Nucleus'],
            correctAnswer: 2,
            explanation: 'Chloroplasts are unique to plant cells and some protists. They contain chlorophyll and are the site of photosynthesis.',
            difficulty: 'Easy'
          },
          {
            question: 'Lysosomes are formed by:',
            options: ['Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum', 'Nucleus'],
            correctAnswer: 1,
            explanation: 'Lysosomes are formed by the Golgi apparatus, which packages digestive enzymes into membrane-bound vesicles.',
            difficulty: 'Medium'
          }
        ],
        keyPoints: [
          'Cell theory: all life is made of cells, cells are basic units of life, cells come from cells',
          'Prokaryotes lack membrane-bound nucleus; eukaryotes have membrane-bound nucleus',
          'Each organelle has specific functions essential for cell survival',
          'Cell membrane controls what enters and exits the cell',
          'Plant and animal cells have both similarities and differences',
          'Endosymbiotic theory explains origin of mitochondria and chloroplasts',
          'Transport across membranes can be passive or active',
          'Cytoskeleton provides structural support and enables movement'
        ],
        formulas: [
          {
            name: 'Surface Area to Volume Ratio',
            formula: 'SA:V = 6/r (for sphere)',
            description: 'Determines efficiency of material exchange across cell membrane'
          },
          {
            name: 'Osmotic Pressure',
            formula: 'π = iMRT',
            description: 'Pressure needed to prevent osmotic flow of water'
          }
        ]
      },
      estimatedReadTime: 35,
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